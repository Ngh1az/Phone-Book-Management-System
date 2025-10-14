<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class GroupController extends Controller
{
    /**
     * Display a listing of the user's groups.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Group::query()
            ->forUser($request->user()->id)
            ->withContactsCount();

        // Apply search filter
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Sort by latest or oldest
        $sortOrder = $request->input('sort', 'latest');
        if ($sortOrder === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $groups = $query->paginate($request->input('per_page', 15));

        return GroupResource::collection($groups);
    }

    /**
     * Store a newly created group.
     *
     * @param Request $request
     * @return GroupResource
     */
    public function store(Request $request): GroupResource
    {
        $this->authorize('create', Group::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('groups')->where('user_id', $request->user()->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $group = $request->user()->groups()->create($validated);

        return new GroupResource($group);
    }

    /**
     * Display the specified group.
     *
     * @param Group $group
     * @return GroupResource
     */
    public function show(Group $group): GroupResource
    {
        $this->authorize('view', $group);

        $group->loadCount('contacts');

        return new GroupResource($group);
    }

    /**
     * Update the specified group.
     *
     * @param Request $request
     * @param Group $group
     * @return GroupResource
     */
    public function update(Request $request, Group $group): GroupResource
    {
        $this->authorize('update', $group);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('groups')->where('user_id', $request->user()->id)->ignore($group->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $group->update($validated);

        return new GroupResource($group);
    }

    /**
     * Remove the specified group.
     *
     * @param Group $group
     * @return JsonResponse
     */
    public function destroy(Group $group): JsonResponse
    {
        $this->authorize('delete', $group);

        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully',
        ]);
    }
}
