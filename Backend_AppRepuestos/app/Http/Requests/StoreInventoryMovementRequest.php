<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryMovementRequest extends FormRequest
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
            'part_id' => ['required','exists:parts,id'],
            'type' => ['required','in:in,out,adjustment'],
            'quantity' => ['required','integer','min:1'],
            'performed_by_user_id' => ['required','exists:users,id'],
            'performed_at' => ['required','date'],
            'notes' => ['nullable','string'],
        ];
    }
}
