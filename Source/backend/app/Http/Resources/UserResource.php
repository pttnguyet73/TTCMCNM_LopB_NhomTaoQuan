<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone ?? null,
            'profile_photo_path' => $this->profile_photo_path ?? null,
            'profile_photo_url' => $this->profile_photo_url ?? null,
            'role' => $this->role,
        ];
    }
}
