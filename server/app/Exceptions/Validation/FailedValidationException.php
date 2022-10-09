<?php

namespace App\Exceptions\Validation;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class FailedValidationException extends ValidationException implements Responsable
{
    public function toResponse($request)
    {
        $message = $this->getMessage();

        foreach ($this->errors() as $key => $value) {
            if (is_array($value)) {
                $message = Arr::first($value);
                break;
            }
        }

        return response()->json([
            'status' => 'fail',
            'error' => [
                'code' => JsonResponse::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $message,
                'type' => 'failed_validation'
            ]
        ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
    }
}
