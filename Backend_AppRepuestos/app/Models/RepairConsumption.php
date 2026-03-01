<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RepairConsumption extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'repair_id',
        'part_id',
        'quantity',
        'created_by_user_id',
    ];

    public function repair()
    {
        return $this->belongsTo(Repair::class);
    }

    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
