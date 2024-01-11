Certainly! Here's the code snippet that you can include in your README.md file:

```markdown
# User Authentication API Documentation

## Overview

This API provides comprehensive endpoints for user authentication, facilitating user registration, login, password reset, profile updates, and user retrieval.

## Base URL

`https://your-api-base-url.com/api/auth`

## Endpoint: Register a User

**POST /register**

### Request Body

```json
{
  "studentId": "string",
  "schoolPassword": "string",
  "userpassword": "string",
  "username": "string",
  "securityQuestion": "string",
  "fullName": "string",
  "fieldOfStudy": "string",
  "profilePic": "string"
}
```

### Responses

**HTTP Status Code: 201 Created**

```json
{
  "token": "string",
  "user": {
    "userId": "string",
    "username": "string",
    "fullName": "string",
    "fieldOfStudy": "string",
    "profilePic": "string"
  }
}
```

**HTTP Status Code: 400 Bad Request**

```json
{
  "message": "An error occurred while registering the user."
}
```

```


## Endpoint: Login

**POST /login**

### Request Body

```json
{
  "username": "string",
  "userpassword": "string"
}
```

### Responses

**HTTP Status Code: 200 OK**

```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "userId": "string",
    "username": "string",
    "fullName": "string",
    "fieldOfStudy": "string",
    "profilePic": "string"
  }
}
```

**HTTP Status Code: 400 Bad Request**

```json
{
  "message": "An error occurred while logging in."
}
```






## Endpoint: Reset Password

**POST /reset-password**

### Request Body

```json
{
  "username": "string",
  "securityQuestionAnswer": "string",
  "newPassword": "string"
}
```

### Responses

**HTTP Status Code: 200 OK**

```json
{
  "message": "Password reset successful"
}
```

**HTTP Status Code: 400 Bad Request**

```json
{
  "message": "An error occurred during password reset."
}
```
```



```markdown
## Endpoint: Update Profile

**POST /update-profile**

### Request Body

```json
{
  "username": "string",
  "fullName": "string",
  "fieldOfStudy": "string",
  "profilePic": "string"
}
```

### Responses

**HTTP Status Code: 200 OK**

```json
{
  "userId": "string",
  "username": "string",
  "fullName": "string",
  "fieldOfStudy": "string",
  "profilePic": "string"
}
```

**HTTP Status Code: 400 Bad Request**

```json
{
  "message": "An error occurred while updating the user profile."
}
```
```

