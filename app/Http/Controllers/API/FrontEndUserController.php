<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\ThrottlesLogins;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;

use App\User;

use JWTAuth;
use Hash;
use DB;


class FrontEndUserController extends Controller
{
	use ThrottlesLogins;

    public function signUp(UserStoreRequest $request)
	{
		DB::beginTransaction();

	    $user = User::create([
	    	'first_name' => $request->first_name, 
            'last_name' => $request->last_name, 
            'email' => $request->email, 
	    	'username' => $request->username, 
	    	'password' => bcrypt($request->password)
	    ]);

	    $token = JWTAuth::fromSubject($user);

		DB::commit();

        return response()->json([
        	'token' => 'Bearer ' . $token,
            'user' => $user,
        ]);
	}

	/**
     * Fetch the auth token of the specified user
     * @return JSON
     */
    public function signIn(Request $request)
    {   
    	DB::beginTransaction();

        $token = null;
        $action = false;
        $username = $request->input('username');
        $error = ['username' => "Sorry, your username or password is incorrect"];

        $user = User::where('username', $username)->first();

        if(!$user) {
            throw ValidationException::withMessages($error);
        }
       
        $response = Hash::check($request->input('password'), $user->password);

        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        /* Short circuit if password doesn't match */
        if (!$response) {
            $this->incrementLoginAttempts($request);

            throw ValidationException::withMessages($error);
        }

        $token = JWTAuth::fromSubject($user);

        DB::commit();

        return response()->json([
        	'token' => 'Bearer ' . $token,
            'user' => $user,
        ]);
    }

    /**
     * Used on ThrottlesLogins
     * @return string username
     */
    public function username() {
        return 'username';
    }
}
