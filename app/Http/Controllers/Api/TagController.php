<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    /**
     * Display a listing of the user's tags.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
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
     *
     * @param Request $request
     * @return TagResource
     */
    public function store(Request $request): TagResource
    {
        $this->authorize('create', Tag::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('tags')->where('user_id', $request->user()->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        // Auto-generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Ensure slug is unique for this user
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Tag::where('user_id', $request->user()->id)->where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $tag = $request->user()->tags()->create($validated);

        return new TagResource($tag);
    }

    /**
     * Display the specified tag.
     *
     * @param Tag $tag
     * @return TagResource
     */
    public function show(Tag $tag): TagResource
    {
        $this->authorize('view', $tag);

        $tag->loadCount('contacts');

        return new TagResource($tag);
    }

    /**
     * Update the specified tag.
     *
     * @param Request $request
     * @param Tag $tag
     * @return TagResource
     */
    public function update(Request $request, Tag $tag): TagResource
    {
        $this->authorize('update', $tag);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('tags')->where('user_id', $request->user()->id)->ignore($tag->id)],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        // Update slug if name changed
        if (isset($validated['name']) && $validated['name'] !== $tag->name) {
            $validated['slug'] = Str::slug($validated['name']);

            // Ensure slug is unique
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Tag::where('user_id', $request->user()->id)->where('slug', $validated['slug'])->where('id', '!=', $tag->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $tag->update($validated);

        return new TagResource($tag);
    }

    /**
     * Remove the specified tag.
     *
     * @param Tag $tag
     * @return JsonResponse
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
