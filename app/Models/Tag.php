<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'color',
    ];

    /**
     * Get the user that owns the tag.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The contacts that belong to the tag.
     */
    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, 'contact_tag')
            ->withTimestamps();
    }

    /**
     * Scope a query to filter by user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to order tags by name.
     */
    public function scopeOrderByName(Builder $query, string $direction = 'asc'): Builder
    {
        return $query->orderBy('name', $direction);
    }

    /**
     * Scope to include contacts count.
     * Usage: Tag::withContactsCount()->get()
     */
    public function scopeWithContactsCount(Builder $query): Builder
    {
        return $query->withCount('contacts');
    }

    /**
     * Scope to search tags by name.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->whereRaw('LOWER(name) LIKE ?', ["%".strtolower(trim($search))."%"]);
    }
}
