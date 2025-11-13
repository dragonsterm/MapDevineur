<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameRound extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'location_id',
        'round_number',
        'guess_latitude',
        'guess_longitude',
        'distance',
        'time_taken',
        'round_score',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
