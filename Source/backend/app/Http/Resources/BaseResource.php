<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    public static function apiPaginate($query, $request)
    {
        if (($pageSizeInput = (int) $request->page_size) > 0) {
            $pageSize = min($pageSizeInput, 3);
        } else {
            $pageSize = 3;
        }

        return static::collection($query->paginate($pageSize)->appends($request->query()))
            ->response()
            ->getData();
    }
}
