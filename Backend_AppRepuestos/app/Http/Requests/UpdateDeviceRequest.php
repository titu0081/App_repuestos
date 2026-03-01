<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
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
            'serial_number' => ['sometimes','nullable','string','max:255'],
            'model' => ['sometimes','string','max:255'],
            'received_at' => ['sometimes','date'],
            'received_by_user_id' => ['sometimes','exists:users,id'],
            'client_id' => ['sometimes','exists:clients,id'],
            'reported_issue' => ['sometimes','string'],
            'status' => ['sometimes','string'],
        ];
    }
}
