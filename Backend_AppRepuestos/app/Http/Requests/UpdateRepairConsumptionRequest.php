<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRepairConsumptionRequest extends FormRequest
{
    public function authorize(): bool
     { return true; }

    public function rules(): array
    {
        return [
            'repair_id' => ['sometimes', 'exists:repairs,id'],
            'part_id' => ['sometimes', 'exists:parts,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'created_by_user_id' => ['sometimes', 'exists:users,id'],
        ];
    }
}
