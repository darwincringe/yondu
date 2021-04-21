<?php

namespace App\Http\Middleware\API;

use Closure;
use JWTAuth;

class Authenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $auth_guard = JWTAuth::getPayload()->get('guard');

        if ($guard != $auth_guard) {
            abort(403);
        }

        return $next($request);
    }
}
