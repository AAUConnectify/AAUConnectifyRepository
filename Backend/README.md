# User Authentication API Documentation

## Overview

This API provides endpoints for user authentication, including user registration, login, password reset, profile updates, and user retrieval.

## Base URL

`https://your-api-base-url.com/api/auth`

## Endpoints

### Register a User

**Endpoint**: `POST /register`

**Request Body**:

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


Response:

HTTP Status Code: 201 Created


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



HTTP Status Code: 400 Bad Request

{
  "message": "An error occurred while registering the user."
}



Login
Endpoint: POST /login


{
  "username": "string",
  "userpassword": "string"
}




Response:

HTTP Status Code: 200 OK

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



HTTP Status Code: 400 Bad Request

{
  "message": "An error occurred while logging in."
}


Reset Password
Endpoint: POST /reset-password

Request Body:

{
  "username": "string",
  "securityQuestionAnswer": "string",
  "newPassword": "string"
}


Response:

HTTP Status Code: 200 OK


{
  "message": "Password reset successful"
}



HTTP Status Code: 400 Bad Request

{
  "message": "An error occurred during password reset."
}



Update Profile
Endpoint: POST /update-profile

Request Body:

{
  "username": "string",
  "fullName": "string",
  "fieldOfStudy": "string",
  "profilePic": "string"
}


Response:

HTTP Status Code: 200 OK

{
  "userId": "string",
  "username": "string",
  "fullName": "string",
  "fieldOfStudy": "string",
  "profilePic": "string"
}


HTTP Status Code: 400 Bad Request

{
  "message": "An error occurred while updating the user profile."
}


