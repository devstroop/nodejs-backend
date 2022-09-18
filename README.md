# nodejs-backend
## Sign Up
Register new user
> /api/signup
```
{
  "name": "User",
  "email": "user@example.com",
  "password": "password"
}
```
## Sign In
> /api/signin
```
{
  "email": "user@example.com",
  "password": "password"
}
```

## Reset Password
> /api/forgot-password
```
{
  "email": "user@example.com"
}
```
Magic link will be logged in console, same should be mailed to registered email

> Call magic link with body
> /api/reset-password/xxxxxxxx/xxxxxxxx
```
{
  "password": "newPassword",
  "confirmPassword": "newPassword",
}
```
