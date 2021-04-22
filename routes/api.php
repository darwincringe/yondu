<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::name('api.')->namespace('API')->group(function() {

	Route::post('/signup', 'FrontEndUserController@signUp');
	Route::post('/signin', 'FrontEndUserController@signIn');

	Route::group(['middleware' => ['assign.guard:web', 'jwt.auth', 'api.auth:web']], function() {
		Route::post('/profile', 'HomeController@profile')->name('profile');

		Route::group(['middleware' => ['isAdmin']], function() {

			Route::post('/fetch-users', 'AdminController@fetchUsers')->name('fetch-users');
			Route::post('/create-users', 'AdminController@create')->name('create-users');
			Route::post('/update-users', 'AdminController@update')->name('update-users');
			Route::post('/delete-users', 'AdminController@delete')->name('delete-users');
			Route::post('/change-password-users', 'AdminController@changePassowrd')->name('change-password-users');
		
		});

	});

});