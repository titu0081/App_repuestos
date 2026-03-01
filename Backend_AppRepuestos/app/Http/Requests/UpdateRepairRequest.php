<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRepairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'device_id' => ['sometimes','exists:devices,id'],
            'technician_user_id' => ['sometimes','exists:users,id'],
            'started_at' => ['sometimes','date'],
            'finished_at' => ['sometimes','nullable','date'],
            'actions_performed' => ['sometimes','string'],
        ];
    }
}
