<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceRequest extends FormRequest
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
            'serial_number' => ['nullable','string','max:255'],
            'model' => ['required','string','max:255'],
            'received_at' => ['required','date'],
            'received_by_user_id' => ['required','exists:users,id'],
            'client_id' => ['required','exists:clients,id'],
            'reported_issue' => ['required','string'],
            'status' => ['required','string'],
        ];
    }
}
