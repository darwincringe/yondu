## About The System

The scope and feature of this project are as follows:

- Backend: Laravel 5.8
- API: JWT
- User/Admin authentication
- Add a new user
- Edit a user
- Delete a user
- View list of all users in the system 
- Allow multiple users to be removed  

Post deployment intructions:

- cp .env.example .env 
- composer install
- php artisan migrate
- php artisan key:generate
- php artisan jwt:secret
- npm install
- npm run watch