<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryMovement extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'part_id',
        'type',
        'quantity',
        'performed_by_user_id',
        'performed_at',
        'notes',
    ];

    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    public function performedBy()
    {
        return $this->belongsTo(User::class, 'performed_by_user_id');
    }
}