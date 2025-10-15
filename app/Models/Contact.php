<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The relationships that should always be loaded.
     * Note: Tags are not eagerly loaded by default to avoid performance issues
     * Use ->with('tags') explicitly when needed
     *
     * @var array<int, string>
     */
    protected $with = ['group'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'group_id',
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'address',
        'company',
        'job_title',
        'birthday',
        'notes',
        'is_favorite',
        'avatar',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birthday' => 'date',
        'is_favorite' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['full_name', 'avatar_url'];

    /**
     * Get the user that owns the contact.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the group that the contact belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * The tags that belong to the contact.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'contact_tag')
            ->withTimestamps();
    }

    /**
     * Get the full name of the contact (Laravel 11+ style).
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => trim("{$this->first_name} {$this->last_name}")
        );
    }

    /**
     * Get the full URL for the avatar.
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar ? asset('storage/' . $this->avatar) : null
        );
    }

    /**
     * Scope a query to only include favorite contacts.
     */
    public function scopeFavorite(Builder $query): Builder
    {
        return $query->where('is_favorite', true);
    }

    /**
     * Scope a query to search contacts (optimized for performance).
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        $search = trim($search);

        return $query->where(function (Builder $q) use ($search) {
            $q->whereRaw('LOWER(first_name) LIKE ?', ["%".strtolower($search)."%"])
                ->orWhereRaw('LOWER(last_name) LIKE ?', ["%".strtolower($search)."%"])
                ->orWhereRaw('REPLACE(phone_number, " ", "") LIKE ?', ["%".str_replace([' ', '-', '(', ')'], '', $search)."%"])
                ->orWhereRaw('LOWER(email) LIKE ?', ["%".strtolower($search)."%"])
                ->orWhereRaw('LOWER(company) LIKE ?', ["%".strtolower($search)."%"]);
        });
    }

    /**
     * Scope a query to filter by group.
     */
    public function scopeByGroup(Builder $query, ?int $groupId): Builder
    {
        if ($groupId === null) {
            return $query;
        }

        return $query->where('group_id', $groupId);
    }

    /**
     * Scope a query to filter by user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to filter contacts that have a specific tag.
     */
    public function scopeWithTag(Builder $query, ?int $tagId): Builder
    {
        if ($tagId === null) {
            return $query;
        }

        return $query->whereHas('tags', function (Builder $q) use ($tagId) {
            $q->where('tags.id', $tagId);
        });
    }

    /**
     * Scope to order contacts by name.
     */
    public function scopeOrderByName(Builder $query, string $direction = 'asc'): Builder
    {
        return $query->orderBy('first_name', $direction)
                     ->orderBy('last_name', $direction);
    }

    /**
     * Scope to load contacts with all relationships.
     */
    public function scopeWithAllRelations(Builder $query): Builder
    {
        return $query->with(['group', 'tags', 'user']);
    }

    /**
     * Scope to load contacts with tags count.
     */
    public function scopeWithTagsCount(Builder $query): Builder
    {
        return $query->withCount('tags');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
