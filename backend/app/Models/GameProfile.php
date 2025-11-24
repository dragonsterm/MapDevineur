<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameProfile extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'game_profiles';

    protected $fillable = [
        'user_id',
        'display_name',
        'country',
        'gender',
        'bio',
        'date_of_birth',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}