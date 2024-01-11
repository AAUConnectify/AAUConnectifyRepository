Certainly! Here's the code snippet that you can include in your README.md file:

```markdown
# User Authentication API Documentation

## Overview

This API provides comprehensive endpoints for user authentication, facilitating user registration, login, password reset, profile updates, and user retrieval.

## Base URL

`http://localhost:5011/api/#/auth`

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




# Announcement API

The Announcement API allows users to create, retrieve, update, and delete announcements. Users can also like announcements and retrieve a list of liked announcements.

## Base URL

`https://api.example.com/announcements`

## Authentication

All endpoints, except for the `GET /announcements` and `GET /announcements/:id` endpoints, require authentication using the AuthGuard. Include the `Authorization` header with a valid authentication token in the request.

## Endpoints

### Create Announcement

- **URL:** `/announcements`
- **Method:** `POST`
- **Authentication Required:** Yes
- **Request Body:**
  - `title` (string, required): The title of the announcement.
  - `content` (string, required): The content of the announcement.
  - `imageUrl` (string, optional): The URL of the image associated with the announcement.
- **Response:**
  - `announcement` (object): The created announcement.

### Get Announcements

- **URL:** `/announcements`
- **Method:** `GET`
- **Authentication Required:** No
- **Response:**
  - `announcements` (array of objects): The list of announcements.

### Get Announcement by ID

- **URL:** `/announcements/:id`
- **Method:** `GET`
- **Authentication Required:** No
- **Parameters:**
  - `id` (string, required): The ID of the announcement.
- **Response:**
  - `announcement` (object): The announcement with the specified ID.

### Update Announcement

- **URL:** `/announcements/:id`
- **Method:** `PUT`
- **Authentication Required:** Yes
- **Parameters:**
  - `id` (string, required): The ID of the announcement to update.
- **Request Body:**
  - `title` (string, required): The updated title of the announcement.
  - `content` (string, required): The updated content of the announcement.
  - `imageUrl` (string, optional): The updated URL of the image associated with the announcement.
- **Response:**
  - `announcement` (object): The updated announcement.

### Delete Announcement

- **URL:** `/announcements/:id`
- **Method:** `DELETE`
- **Authentication Required:** Yes
- **Parameters:**
  - `id` (string, required): The ID of the announcement to delete.
- **Response:**
  - `message` (string): A success message indicating that the announcement was deleted successfully.

### Like Announcement

- **URL:** `/announcements/:id/like`
- **Method:** `POST`
- **Authentication Required:** Yes
- **Parameters:**
  - `id` (string, required): The ID of the announcement to like.
- **Response:**
  - `announcement` (object): The liked announcement.

### Get Liked Announcements

- **URL:** `/liked-announcements`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Response:**
  - `announcements` (array of objects): The list of announcements liked by the authenticated user.
