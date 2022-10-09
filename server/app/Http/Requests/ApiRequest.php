<?php

namespace App\Http\Requests;

use App\Exceptions\Validation\FailedValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

abstract class ApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    abstract function rules();

    protected function failedValidation(Validator $validator)
    {
        throw new FailedValidationException($validator);
    }
}
