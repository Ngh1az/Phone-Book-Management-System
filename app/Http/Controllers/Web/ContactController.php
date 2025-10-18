<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Models\Group;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the contacts.
     */
    public function index(Request $request)
    {
        $query = Contact::query()
            ->forUser(auth()->id())
            ->with(['group', 'tags'])
            ->orderByName();

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('group_id')) {
            $query->byGroup($request->group_id);
        }

        if ($request->filled('tag_id')) {
            $query->withTag($request->tag_id);
        }

        // Only filter favorites if explicitly set to '1' or 'true'
        if ($request->filled('is_favorite') && $request->boolean('is_favorite')) {
            $query->favorite();
        }

        $contacts = $query->paginate($request->input('per_page', 15))
            ->withQueryString();

        // Get groups and tags for filters
        $groups = Group::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        $tags = Tag::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
            'groups' => $groups,
            'tags' => $tags,
            'filters' => $request->only(['search', 'group_id', 'tag_id', 'is_favorite']),
        ]);
    }

    /**
     * Show the form for creating a new contact.
     */
    public function create()
    {
        $groups = Group::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        $tags = Tag::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('contacts/create', [
            'groups' => $groups,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created contact in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $this->authorize('create', Contact::class);

        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Handle avatar upload if provided
        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $contact = Contact::create($data);

        // Attach tags if provided
        if ($request->has('tags')) {
            $contact->tags()->sync($request->tags);
        }

        return Redirect::route('contacts.index')
            ->with('success', 'Contact created successfully.');
    }

    /**
     * Display the specified contact.
     */
    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        $contact->load(['group', 'tags']);

        return Inertia::render('contacts/show', [
            'contact' => $contact,
        ]);
    }

    /**
     * Show the form for editing the specified contact.
     */
    public function edit(Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->load('tags');

        $groups = Group::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        $tags = Tag::forUser(auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('contacts/edit', [
            'contact' => $contact,
            'groups' => $groups,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified contact in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $data = $request->validated();

        // Handle avatar upload if provided
        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $contact->update($data);

        // Sync tags if provided
        if ($request->has('tags')) {
            $contact->tags()->sync($request->tags);
        }

        return Redirect::route('contacts.show', $contact)
            ->with('success', 'Contact updated successfully.');
    }

    /**
     * Remove the specified contact from storage.
     */
    public function destroy(Contact $contact)
    {
        $this->authorize('delete', $contact);

        $contact->delete();

        return Redirect::route('contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }

    /**
     * Toggle the favorite status of the specified contact.
     */
    public function toggleFavorite(Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->update([
            'is_favorite' => !$contact->is_favorite,
        ]);

        return Redirect::back()
            ->with('success', $contact->is_favorite ? 'Added to favorites.' : 'Removed from favorites.');
    }

    /**
     * Display a listing of trashed contacts.
     */
    public function trash(Request $request)
    {
        $contacts = Contact::onlyTrashed()
            ->forUser(auth()->id())
            ->with(['group', 'tags'])
            ->latest('deleted_at')
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('contacts/trash', [
            'contacts' => $contacts,
        ]);
    }

    /**
     * Restore a soft-deleted contact.
     */
    public function restore(int $id)
    {
        $contact = Contact::onlyTrashed()->findOrFail($id);

        $this->authorize('restore', $contact);

        $contact->restore();

        return Redirect::back()
            ->with('success', 'Contact restored successfully.');
    }

    /**
     * Permanently delete a contact.
     */
    public function forceDelete(int $id)
    {
        $contact = Contact::onlyTrashed()->findOrFail($id);

        $this->authorize('forceDelete', $contact);

        $contact->forceDelete();

        return Redirect::back()
            ->with('success', 'Contact permanently deleted.');
    }
}
