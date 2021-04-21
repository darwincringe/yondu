<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{

    public function profile(Request $request)
    {   
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
