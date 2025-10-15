<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Group;
use App\Models\Tag;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $userId = auth()->id();

        // Get statistics
        $stats = [
            'total_contacts' => Contact::forUser($userId)->count(),
            'favorite_contacts' => Contact::forUser($userId)->favorite()->count(),
            'total_groups' => Group::forUser($userId)->count(),
            'total_tags' => Tag::forUser($userId)->count(),
        ];

        // Get recent contacts (last 5)
        $recentContacts = Contact::forUser($userId)
            ->with(['group', 'tags'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get groups with contact counts
        $groups = Group::forUser($userId)
            ->withCount('contacts')
            ->orderBy('contacts_count', 'desc')
            ->limit(5)
            ->get();

        // Get popular tags
        $tags = Tag::forUser($userId)
            ->withCount('contacts')
            ->orderBy('contacts_count', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentContacts' => $recentContacts,
            'groups' => $groups,
            'tags' => $tags,
        ]);
    }
}
