<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of tags.
     */
    public function index(Request $request)
    {
        $query = Tag::query()
            ->forUser(auth()->id())
            ->withCount('contacts')
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $tags = $query->paginate(15)->withQueryString();

        return Inertia::render('tags/index', [
            'tags' => $tags,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new tag.
     */
    public function create()
    {
        return Inertia::render('tags/create');
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tags', 'name')
                    ->where('user_id', auth()->id()),
            ],
            'color' => ['required', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        $validated['user_id'] = auth()->id();
        $validated['slug'] = $this->generateUniqueSlug($validated['name']);

        Tag::create($validated);

        return Redirect::route('tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified tag.
     */
    public function show(Tag $tag)
    {
        $this->authorize('view', $tag);

        $tag->loadCount('contacts');
        $contacts = $tag->contacts()
            ->orderBy('first_name')
            ->paginate(15);

        return Inertia::render('tags/show', [
            'tag' => $tag,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Show the form for editing the specified tag.
     */
    public function edit(Tag $tag)
    {
        $this->authorize('update', $tag);

        return Inertia::render('tags/edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, Tag $tag)
    {
        $this->authorize('update', $tag);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tags', 'name')
                    ->where('user_id', auth()->id())
                    ->ignore($tag->id),
            ],
            'color' => ['required', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        // Update slug if name changed
        if ($validated['name'] !== $tag->name) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name'], $tag->id);
        }

        $tag->update($validated);

        return Redirect::route('tags.show', $tag)
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Tag $tag)
    {
        $this->authorize('delete', $tag);

        $tag->delete();

        return Redirect::route('tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    /**
     * Generate a unique slug for the tag.
     */
    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (
            Tag::where('slug', $slug)
                ->where('user_id', auth()->id())
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }
}
