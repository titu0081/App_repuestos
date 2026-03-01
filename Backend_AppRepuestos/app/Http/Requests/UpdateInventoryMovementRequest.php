<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryMovementRequest extends FormRequest
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
            'part_id' => ['sometimes','exists:parts,id'],
            'type' => ['sometimes','in:in,out,adjustment'],
            'quantity' => ['sometimes','integer','min:1'],
            'performed_by_user_id' => ['sometimes','exists:users,id'],
            'performed_at' => ['sometimes','date'],
            'notes' => ['sometimes','nullable','string'],
        ];
    }
}
