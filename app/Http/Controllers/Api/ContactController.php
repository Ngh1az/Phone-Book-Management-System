<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ContactController extends Controller
{
    /**
     * Display a listing of the user's contacts.
     *
     * Supports filtering by:
     * - search: Search by name, email, phone
     * - group_id: Filter by group
     * - tag_id: Filter by tag
     * - is_favorite: Filter favorites
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Contact::query()
            ->forUser($request->user()->id)
            ->with(['group', 'tags']);

        // Apply search filter
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Filter by group
        if ($request->filled('group_id')) {
            $query->byGroup($request->input('group_id'));
        }

        // Filter by tag
        if ($request->filled('tag_id')) {
            $query->withTag($request->input('tag_id'));
        }

        // Filter favorites
        if ($request->boolean('is_favorite')) {
            $query->favorite();
        }

        // Sort by latest or oldest
        $sortOrder = $request->input('sort', 'latest');
        if ($sortOrder === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $contacts = $query->paginate($request->input('per_page', 15));

        return ContactResource::collection($contacts);
    }

    /**
     * Store a newly created contact.
     *
     * @param StoreContactRequest $request
     * @return ContactResource
     */
    public function store(StoreContactRequest $request): ContactResource
    {
        $this->authorize('create', Contact::class);

        $contact = $request->user()->contacts()->create($request->validated());

        // Attach tags if provided
        if ($request->filled('tag_ids')) {
            $contact->tags()->attach($request->input('tag_ids'));
        }

        $contact->load(['group', 'tags']);

        return new ContactResource($contact);
    }

    /**
     * Display the specified contact.
     *
     * @param Contact $contact
     * @return ContactResource
     */
    public function show(Contact $contact): ContactResource
    {
        $this->authorize('view', $contact);

        $contact->load(['group', 'tags']);

        return new ContactResource($contact);
    }

    /**
     * Update the specified contact.
     *
     * @param UpdateContactRequest $request
     * @param Contact $contact
     * @return ContactResource
     */
    public function update(UpdateContactRequest $request, Contact $contact): ContactResource
    {
        $this->authorize('update', $contact);

        $contact->update($request->validated());

        // Sync tags if provided
        if ($request->has('tag_ids')) {
            $contact->tags()->sync($request->input('tag_ids', []));
        }

        $contact->load(['group', 'tags']);

        return new ContactResource($contact);
    }

    /**
     * Remove the specified contact.
     *
     * @param Contact $contact
     * @return JsonResponse
     */
    public function destroy(Contact $contact): JsonResponse
    {
        $this->authorize('delete', $contact);

        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted successfully',
        ]);
    }

    /**
     * Toggle favorite status.
     *
     * @param Request $request
     * @param Contact $contact
     * @return ContactResource
     */
    public function toggleFavorite(Request $request, Contact $contact): ContactResource
    {
        $this->authorize('update', $contact);

        $contact->update([
            'is_favorite' => !$contact->is_favorite,
        ]);

        $contact->load(['group', 'tags']);

        return new ContactResource($contact);
    }

    /**
     * Restore a soft-deleted contact.
     *
     * @param int $id
     * @return ContactResource
     */
    public function restore(int $id): ContactResource
    {
        $contact = Contact::onlyTrashed()->findOrFail($id);

        $this->authorize('restore', $contact);

        $contact->restore();
        $contact->load(['group', 'tags']);

        return new ContactResource($contact);
    }

    /**
     * Get trashed contacts for the authenticated user.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function trashed(Request $request): AnonymousResourceCollection
    {
        $contacts = Contact::onlyTrashed()
            ->forUser($request->user()->id)
            ->with(['group', 'tags'])
            ->latest()
            ->paginate($request->input('per_page', 15));

        return ContactResource::collection($contacts);
    }
}
