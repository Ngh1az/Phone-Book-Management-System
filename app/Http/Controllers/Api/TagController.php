<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    /**
     * Display a listing of the user's tags.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Tag::query()
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

        $tags = $query->paginate($request->input('per_page', 15));

        return TagResource::collection($tags);
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request): TagResource
    {
        $this->authorize('create', Tag::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('tags')->where('user_id', $request->user()->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $tag = $request->user()->tags()->create($validated);

        return new TagResource($tag);
    }

    /**
     * Display the specified tag.
     */
    public function show(Tag $tag): TagResource
    {
        $this->authorize('view', $tag);

        $tag->loadCount('contacts');

        return new TagResource($tag);
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, Tag $tag): TagResource
    {
        $this->authorize('update', $tag);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('tags')->where('user_id', $request->user()->id)->ignore($tag->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $tag->update($validated);

        return new TagResource($tag);
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Tag $tag): JsonResponse
    {
        $this->authorize('delete', $tag);

        $tag->delete();

        return response()->json([
            'message' => 'Tag deleted successfully',
        ]);
    }
}
