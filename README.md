# User Authentication & Organisation Backend

This is the backend implementation for user authentication and organization management using Node.js and PostgreSQL. The backend provides endpoints for user registration, login, and organization management. A cron job is enabled to ensure minimal downtime.

## Backend URL

[Backend URL](https://hng-task-2-o57r.onrender.com/)

## Features

- User registration and login
- Password hashing
- JWT-based authentication
- Organization management
- Protected routes for authenticated users
- Validation for all fields

## Technologies Used

- Node.js
- Express
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Database Models

### User Model

```json
{
  "userId": "string", // must be unique
  "firstName": "string", // must not be null
  "lastName": "string", // must not be null
  "email": "string", // must be unique and must not be null
  "password": "string", // must not be null
  "phone": "string"
}
```

### Organisation Model

```json
{
  "orgId": "string", // Unique
  "name": "string", // Required and cannot be null
  "description": "string",
  "users": "jsonb" // Array of user IDs
}
```

## Endpoints

### [POST] /auth/register

Registers a user and creates a default organization.

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

**Unsuccessful Response:**

```json
{
  "status": "Bad request",
  "message": "Registration unsuccessful",
  "statusCode": 400
}
```

### [POST] /auth/login

Logs in a user.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

**Unsuccessful Response:**

```json
{
  "status": "Bad request",
  "message": "Authentication failed",
  "statusCode": 401
}
```

### [GET] /api/users/:id

Gets a user's own record or user record in organizations they belong to or created. [PROTECTED]

**Successful Response:**

```json
{
  "status": "success",
  "message": "<message>",
  "data": {
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### [GET] /api/organisations

Gets all organizations the user belongs to or created. [PROTECTED]

**Successful Response:**

```json
{
  "status": "success",
  "message": "<message>",
  "data": {
    "organisations": [
      {
        "orgId": "string",
        "name": "string",
        "description": "string"
      }
    ]
  }
}
```

### [GET] /api/organisations/:orgId

Gets a single organization record the logged-in user belongs to. [PROTECTED]

**Successful Response:**

```json
{
  "status": "success",
  "message": "<message>",
  "data": {
    "orgId": "string", // Unique
    "name": "string", // Required and cannot be null
    "description": "string"
  }
}
```

### [POST] /api/organisations

Creates a new organization. [PROTECTED]

**Request Body:**

```json
{
  "name": "string", // Required and cannot be null
  "description": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "Organisation created successfully",
  "data": {
    "orgId": "string",
    "name": "string",
    "description": "string"
  }
}
```

**Unsuccessful Response:**

```json
{
  "status": "Bad Request",
  "message": "Client error",
  "statusCode": 400
}
```

### [POST] /api/organisations/:orgId/users

Adds a user to a particular organization. [PROTECTED]

**Request Body:**

```json
{
  "userId": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "User added to organisation successfully"
}
```

## Note

The cron job is enabled, so you don't need to worry about downtime when testing the api url.

## Conclusion

This backend project covers user authentication and organization management. It uses Node.js and PostgreSQL, providing endpoints for user registration, login, and organization management. All endpoints are secured using JWT-based authentication.
