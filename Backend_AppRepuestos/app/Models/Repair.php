<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Repair extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'device_id',
        'technician_user_id',
        'started_at',
        'finished_at',
        'actions_performed',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }

    public function consumptions()
    {
        return $this->hasMany(RepairConsumption::class);
    }
}