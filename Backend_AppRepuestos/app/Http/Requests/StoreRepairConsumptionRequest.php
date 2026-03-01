<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRepairConsumptionRequest extends FormRequest
{
    public function authorize():bool 
    { 
        return true; 
        }

    public function rules(): array
    {
        return [
            'repair_id' => ['required', 'exists:repairs,id'],
            'part_id' => ['required', 'exists:parts,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'created_by_user_id' => ['required', 'exists:users,id'],
        ];
    }
}
