<?php

namespace Tests\Feature\Api;

use App\Models\Contact;
use App\Models\Group;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function test_user_can_list_their_contacts(): void
    {
        Contact::factory()->count(5)->for($this->user)->create();
        Contact::factory()->count(3)->for($this->otherUser)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/contacts');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_user_can_search_contacts(): void
    {
        Contact::factory()->for($this->user)->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        Contact::factory()->for($this->user)->create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/contacts?search=John');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.first_name', 'John');
    }

    public function test_user_can_filter_contacts_by_group(): void
    {
        $group = Group::factory()->for($this->user)->create();
        Contact::factory()->for($this->user)->for($group)->count(3)->create();
        Contact::factory()->for($this->user)->count(2)->create();

        $response = $this->actingAs($this->user)
            ->getJson("/api/contacts?group_id={$group->id}");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_filter_favorite_contacts(): void
    {
        Contact::factory()->for($this->user)->create(['is_favorite' => true]);
        Contact::factory()->for($this->user)->create(['is_favorite' => false]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/contacts?is_favorite=1');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_create_contact(): void
    {
        $group = Group::factory()->for($this->user)->create();
        $tag = Tag::factory()->for($this->user)->create();

        $contactData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone_number' => '+1234567890',
            'group_id' => $group->id,
            'tag_ids' => [$tag->id],
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/contacts', $contactData);

        $response->assertCreated()
            ->assertJsonPath('data.first_name', 'John')
            ->assertJsonPath('data.email', 'john@example.com');

        $this->assertDatabaseHas('contacts', [
            'first_name' => 'John',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_cannot_create_contact_with_other_users_group(): void
    {
        $otherGroup = Group::factory()->for($this->otherUser)->create();

        $contactData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'group_id' => $otherGroup->id,
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/contacts', $contactData);

        $response->assertUnprocessable();
    }

    public function test_user_can_view_their_contact(): void
    {
        $contact = Contact::factory()->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->getJson("/api/contacts/{$contact->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $contact->id);
    }

    public function test_user_cannot_view_other_users_contact(): void
    {
        $contact = Contact::factory()->for($this->otherUser)->create();

        $response = $this->actingAs($this->user)
            ->getJson("/api/contacts/{$contact->id}");

        $response->assertForbidden();
    }

    public function test_user_can_update_their_contact(): void
    {
        $contact = Contact::factory()->for($this->user)->create([
            'first_name' => 'John',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/contacts/{$contact->id}", [
                'first_name' => 'Jane',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.first_name', 'Jane');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Jane',
        ]);
    }

    public function test_user_cannot_update_other_users_contact(): void
    {
        $contact = Contact::factory()->for($this->otherUser)->create();

        $response = $this->actingAs($this->user)
            ->putJson("/api/contacts/{$contact->id}", [
                'first_name' => 'Jane',
            ]);

        $response->assertForbidden();
    }

    public function test_user_can_delete_their_contact(): void
    {
        $contact = Contact::factory()->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/contacts/{$contact->id}");

        $response->assertOk();

        $this->assertSoftDeleted('contacts', [
            'id' => $contact->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_contact(): void
    {
        $contact = Contact::factory()->for($this->otherUser)->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/contacts/{$contact->id}");

        $response->assertForbidden();
    }

    public function test_user_can_toggle_favorite(): void
    {
        $contact = Contact::factory()->for($this->user)->create([
            'is_favorite' => false,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/contacts/{$contact->id}/toggle-favorite");

        $response->assertOk()
            ->assertJsonPath('data.is_favorite', true);

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'is_favorite' => true,
        ]);
    }

    public function test_user_can_list_trashed_contacts(): void
    {
        $contact = Contact::factory()->for($this->user)->create();
        $contact->delete();

        Contact::factory()->for($this->user)->create(); // Active contact

        $response = $this->actingAs($this->user)
            ->getJson('/api/contacts/trashed');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_restore_trashed_contact(): void
    {
        $contact = Contact::factory()->for($this->user)->create();
        $contact->delete();

        $response = $this->actingAs($this->user)
            ->postJson("/api/contacts/{$contact->id}/restore");

        $response->assertOk();

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'deleted_at' => null,
        ]);
    }

    public function test_guest_cannot_access_contacts(): void
    {
        $response = $this->getJson('/api/contacts');

        $response->assertUnauthorized();
    }
}
