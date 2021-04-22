<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use Hash;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function fetchUsers()
    {
        $users = User::all();

        return response()->json([
        	'users' => $users,
        ]);
    }

    public function update(Request $request)
    {
    	$request->validate([
    		'id' => 'required | exists:users,id',
    		'contact_phone_number' => 'nullable | numeric',
    		'post_code' => 'nullable | numeric',
    		'first_name' => 'required',
    		'last_name' => 'required',
    		'username' => 'regex:/^\S*$/u | required | unique:users,username,' . $request->id,
    		'email' => 'required | email | unique:users,email,' . $request->id,
    		'role' => 'required | in:admin,user',
    	]);

    	$vars = $request->only([
    		'first_name',
			'last_name',
			'address',
			'post_code',
			'contact_phone_number',
			'email',
			'username',
			'role',
    	]);

        $user = User::findOrFail($request->id);
        $user->update($vars);

        return response()->json([
        	'message' => 'Successfully udpated a user',
        ]);
    }

    public function create(Request $request)
    {
    	$request->validate([
    		'first_name' => 'required',
    		'contact_phone_number' => 'nullable | numeric',
    		'post_code' => 'nullable | numeric',
    		'last_name' => 'required',
    		'username' => 'regex:/^\S*$/u | required | unique:users,username',
    		'email' => 'required | email | unique:users,email',
    		'role' => 'required | in:admin,user',
    		'password' => 'required | confirmed',
    		'password_confirmation' => 'required',
    	]);

    	$vars = $request->only([
    		'first_name',
			'last_name',
			'address',
			'post_code',
			'contact_phone_number',
			'email',
			'username',
			'role',
    	]);

    	$vars['password'] = Hash::make($request->password);

        $user = User::create($vars);

        return response()->json([
        	'message' => 'Successfully created a user',
        ]);
    }

    public function changePassword(Request $request)
    {
    	$request->validate([
    		'password' => 'required | confirmed',
    		'password_confirmation' => 'required',
    	]);

    	$vars['password'] = Hash::make($request->password);

        $user = User::create($vars);

        return response()->json([
        	'message' => "Successfully changed a user's password",
        ]);
    }

    public function delete(Request $request)
    {
    	$request->validate([
    		'ids' => 'required',
            'ids.*' => 'exists:users,id',
    	]);

    	$user = User::whereIn('id', $request->ids);
    	$user->delete();

        return response()->json([
        	'message' => "Successfully deleted a user",
        ]);
    }


}
