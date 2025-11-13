<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longtitude',
        'country',
        'difficulty',
    ];

    public function gameRounds()
    {
        return $this->hasMany(GameRound::class);
    }
}
