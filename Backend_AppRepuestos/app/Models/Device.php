<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Client;
use App\Models\User;


class Device extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'serial_number',
        'model',
        'received_at',
        'received_by_user_id',
        'client_id',
        'reported_issue',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class,'received_by_user_id');
    }
}