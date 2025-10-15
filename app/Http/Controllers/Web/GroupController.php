<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * Display a listing of groups.
     */
    public function index(Request $request)
    {
        $query = Group::query()
            ->forUser(auth()->id())
            ->withCount('contacts')
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $groups = $query->paginate(15)->withQueryString();

        return Inertia::render('groups/index', [
            'groups' => $groups,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new group.
     */
    public function create()
    {
        return Inertia::render('groups/create');
    }

    /**
     * Store a newly created group.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('groups', 'name')
                    ->where('user_id', auth()->id()),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        $validated['user_id'] = auth()->id();

        Group::create($validated);

        return Redirect::route('groups.index')
            ->with('success', 'Group created successfully.');
    }

    /**
     * Display the specified group.
     */
    public function show(Group $group)
    {
        $this->authorize('view', $group);

        $group->loadCount('contacts');
        $contacts = $group->contacts()
            ->orderBy('first_name')
            ->paginate(15);

        return Inertia::render('groups/show', [
            'group' => $group,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Show the form for editing the specified group.
     */
    public function edit(Group $group)
    {
        $this->authorize('update', $group);

        return Inertia::render('groups/edit', [
            'group' => $group,
        ]);
    }

    /**
     * Update the specified group.
     */
    public function update(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('groups', 'name')
                    ->where('user_id', auth()->id())
                    ->ignore($group->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        $group->update($validated);

        return Redirect::route('groups.show', $group)
            ->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified group.
     */
    public function destroy(Group $group)
    {
        $this->authorize('delete', $group);

        $group->delete();

        return Redirect::route('groups.index')
            ->with('success', 'Group deleted successfully.');
    }
}
