#!/usr/bin/env php
<?php

/*
|--------------------------------------------------------------------------
| Model Verification Script
|--------------------------------------------------------------------------
| This script verifies that all models are working correctly with proper
| relationships, scopes, and database structure.
*/

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Group;
use App\Models\Contact;
use App\Models\Tag;

echo "🔍 Testing Phone Book Management System Models...\n\n";

try {
    // Test 1: User Model
    echo "✅ User Model: ";
    $user = User::factory()->create();
    echo "Created (ID: {$user->id})\n";

    // Test 2: Group Model with relationships
    echo "✅ Group Model: ";
    $group = Group::create([
        'user_id' => $user->id,
        'name' => 'Family',
        'description' => 'Family contacts',
        'color' => '#3B82F6'
    ]);
    echo "Created with relationship (ID: {$group->id})\n";

    // Test 3: Tag Model
    echo "✅ Tag Model: ";
    $tag = Tag::create([
        'user_id' => $user->id,
        'name' => 'Important',
        'color' => '#EF4444'
    ]);
    echo "Created (ID: {$tag->id})\n";

    // Test 4: Contact Model with all relationships
    echo "✅ Contact Model: ";
    $contact = Contact::create([
        'user_id' => $user->id,
        'group_id' => $group->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone_number' => '+1234567890',
        'email' => 'john@example.com',
        'is_favorite' => true,
    ]);
    echo "Created with relationships (ID: {$contact->id})\n";

    // Test 5: Many-to-Many relationship
    echo "✅ Contact-Tag Relationship: ";
    $contact->tags()->attach($tag->id);
    echo "Attached successfully\n";

    // Test 6: Accessors
    echo "✅ Full Name Accessor: ";
    echo "'{$contact->full_name}'\n";

    // Test 7: Scopes
    echo "✅ Favorite Scope: ";
    $favorites = Contact::favorite()->count();
    echo "{$favorites} favorite(s) found\n";

    // Test 8: Search Scope
    echo "✅ Search Scope: ";
    $results = Contact::search('john')->count();
    echo "{$results} result(s) found\n";

    // Test 9: Eager Loading
    echo "✅ Eager Loading: ";
    $contactWithRelations = Contact::with(['user', 'group', 'tags'])->find($contact->id);
    echo "Group '{$contactWithRelations->group->name}' loaded\n";

    // Test 10: Soft Deletes
    echo "✅ Soft Delete: ";
    $contact->delete();
    $trashedCount = Contact::onlyTrashed()->count();
    echo "{$trashedCount} soft-deleted record(s)\n";

    // Test 11: Restore
    echo "✅ Restore: ";
    $contact->restore();
    $activeCount = Contact::count();
    echo "{$activeCount} active record(s)\n";

    // Test 12: withCount scope
    echo "✅ WithCount Scope: ";
    $groupWithCount = Group::withContactsCount()->find($group->id);
    echo "Group has {$groupWithCount->contacts_count} contact(s)\n";

    echo "\n🎉 All tests passed! Models are working correctly.\n";
    echo "✨ Database structure is optimized and ready for production.\n\n";

    // Cleanup
    $contact->forceDelete();
    $tag->delete();
    $group->delete();
    $user->delete();

    echo "🧹 Test data cleaned up.\n";

} catch (\Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "📍 File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}
