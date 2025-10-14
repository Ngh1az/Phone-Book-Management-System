<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model policies for authorization
        // Laravel 11+ auto-discovers policies, but explicit registration is clearer
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Contact::class, \App\Policies\ContactPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Group::class, \App\Policies\GroupPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Tag::class, \App\Policies\TagPolicy::class);
    }
}
