# nodejs-backend

## Reset Password
### /api/forgot-password
```
{
  "email": "user@example.com"
}
```
Magic link will be logged in console, same should be mailed to registered email

### Call magic link with body
#### /api/reset-password/xxxxxxxx/xxxxxxxx
```
{
  "password": "newPassword",
  "confirmPassword": "newPassword",
}
```
