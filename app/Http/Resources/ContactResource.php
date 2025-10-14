<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'address' => $this->address,
            'company' => $this->company,
            'job_title' => $this->job_title,
            'website' => $this->when(isset($this->website), $this->website),
            'notes' => $this->notes,
            'is_favorite' => $this->is_favorite,
            'avatar_url' => $this->when(isset($this->avatar), $this->avatar),
            'birthday' => $this->birthday?->toDateString(),
            'group' => new GroupResource($this->whenLoaded('group')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
