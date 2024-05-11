# Railway Management System API

This API provides functionalities for managing railway operations including user authentication, train management, and booking services.

## Table of Contents
- [Authentication](#authentication)
  - [Register User](#register-user)
  - [Login](#login)
- [User Management](#user-management)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
  - [Get All Users](#get-all-users)
- [Train Management](#train-management)
  - [Create Train](#create-train)
  - [Get Train by Number](#get-train-by-number)
  - [Update Train Details](#update-train-details)
  - [Delete Train](#delete-train)
  - [Get All Trains](#get-all-trains)
- [Booking Management](#booking-management)
  - [Create Booking](#create-booking)
  - [Get Booking Details](#get-booking-details)
  - [Get All Booking Details](#get-all-booking-details)

## Authentication

### Register User

- **Endpoint:** POST /api/auth/register
- **Description:** Register a new user with the system.
- **Request Body:**
  - username: String (required) - Username of the user.
  - email: String (required) - Email address of the user.
  - password: String (required) - Password of the user.
  - gender: String (required) - Gender of the user.
  - role: String (optional) - Role of the user (default: user).
- **Response:** 
  - 201 Created: User registered successfully.
  - 400 Bad Request: Invalid input parameters.
  - 500 Internal Server Error: Server encountered an error.

### Login

- **Endpoint:** POST /api/auth/login
- **Description:** Login with existing user credentials.
- **Request Body:**
  - email: String (required) - Email address of the user.
  - password: String (required) - Password of the user.
- **Response:** 
  - 200 OK: Login successful. Returns a JWT token.
  - 401 Unauthorized: Invalid credentials.
  - 500 Internal Server Error: Server encountered an error.

## User Management

### Update User

- **Endpoint:** PUT /api/user/:id
- **Description:** Update user details.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Request Parameters:** 
  - id: Integer (required) - User ID.
- **Request Body:**
  - username: String (optional) - New username.
  - email: String (optional) - New email address.
  - password: String (optional) - New password.
  - gender: String (optional) - New gender.
  - role: String (optional) - New role.
- **Response:** 
  - 200 OK: User details updated successfully.
  - 400 Bad Request: Invalid input parameters.
  - 404 Not Found: User not found.
  - 500 Internal Server Error: Server encountered an error.

### Delete User

- **Endpoint:** DELETE /api/user/:id
- **Description:** Delete a user from the system.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Request Parameters:** 
  - id: Integer (required) - User ID.
- **Request Body:**
  - email: String.
  - password: String.  
- **Response:** 
  - 200 OK: User deleted successfully.
  - 404 Not Found: User not found.
  - 500 Internal Server Error: Server encountered an error.

### Get All Users

- **Endpoint:** GET /api/user/all
- **Description:** Retrieve all users in the system (Only Admin can Access this API).
- **Request Headers:** 
  - admin-api-key:123456.
  - jwt-token:Bearer token
- **Response:** 
  - 200 OK: Returns all users.
  - 404 Not Found: No users found.
  - 500 Internal Server Error: Server encountered an error.

## Train Management

### Create Train

- **Endpoint:** POST /api/train/add
- **Description:** Add a new train to the system Only By Admin.
- **Request Headers:** 
  - admin-api-key:123456
  - jwt-token:Bearer token
- **Request Body:**
  - trainNumber: String (required) - Train number.
  - trainName: String (required) - Train name.
  - source: String (required) - Source station.
  - destination: String (required) - Destination station.
  - lastSeatNumber: Integer (optional) - Last seat number.
  - seatsAvailable: Integer (required) - Number of available seats.
- **Response:** 
  - 201 Created: Train created successfully.
  - 400 Bad Request: Invalid input parameters.
  - 500 Internal Server Error: Server encountered an error.

### Get Train Details by Number

- **Endpoint:** GET /api/train/:trainNumber
- **Description:** Retrieve train details by train number.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Request Parameters:** 
  - trainNumber: Integer (required) - Train number.
- **Response:** 
  - 200 OK: Returns train details.
  - 404 Not Found: Train not found.
  - 500 Internal Server Error: Server encountered an error.

### Update Train Details

- **Endpoint:** PUT /api/train/update/:trainNumber
- **Description:** Update train details.
- **Request Headers:** 
  - admin-api-key:123456
  - jwt-token:Bearer token
- **Request Parameters:** 
  - trainNumber: Integer (required) - Train number.
- **Request Body:**
  - trainName: String (optional) - New train name.
  - source: String (optional) - New source station.
  - destination: String (optional) - New destination station.
  - seatsAvailable: Integer (optional) - New number of available seats.
- **Response:** 
  - 200 OK: Train details updated successfully.
  - 400 Bad Request: Invalid input parameters.
  - 404 Not Found: Train not found.
  - 500 Internal Server Error: Server encountered an error.

### Delete Train

- **Endpoint:** DELETE /api/train/delete/:trainNumber
- **Description:** Delete a train from the system.
- **Request Headers:** 
  - admin-api-key:123456
  - jwt-token:Bearer token
- **Request Parameters:** 
  - trainNumber: Integer (required) - Train number.
- **Response:** 
  - 200 OK: Train deleted successfully.
  - 404 Not Found: Train not found.
  - 500 Internal Server Error: Server encountered an error.

### Get All Trains

- **Endpoint:** GET /api/train/all
- **Description:** Retrieve all trains in the system.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Response:** 
  - 200 OK: Returns all trains.
  - 404 Not Found: No trains found.
  - 500 Internal Server Error: Server encountered an error.

## Booking Management

### Create Booking

- **Endpoint:** POST /api/booking/book
- **Description:** Book seats on a train.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Request Body:**
  - email: String (required) - Email address of the passenger.
  - passengerName: String (required) - Name of the passenger.
  - age: Integer (required) - Age of the passenger.
  - trainNumber: String (required) - Train number.
  - numberOfSeats: Integer (required) - Number of seats to book.
- **Response:** 
  - 200 OK: Booking successful.
  - 400 Bad Request: Invalid input parameters or insufficient seats available.
  - 500 Internal Server Error: Server encountered an error.

### Get Booking Details By Id

- **Endpoint:** GET /api/booking/:bookingId
- **Description:** Retrieve booking details by booking ID.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Request Parameters:** 
  - bookingId: Integer (required) - Booking ID.
- **Response:** 
  - 200 OK: Returns booking details.
  - 404 Not Found: Booking not found.
  - 500 Internal Server Error: Server encountered an error.

### Get All Booking Details

- **Endpoint:** GET /api/booking/all
- **Description:** Retrieve all booking details in the system.
- **Request Headers:** 
  - jwt-token:Bearer token
- **Response:** 
  - 200 OK: Returns all booking details.
  - 404 Not Found: No bookings found.
  - 500 Internal Server Error: Server encountered an error.
