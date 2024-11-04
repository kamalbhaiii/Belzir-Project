# Belzir Project

This project is a microservices-based full-stack application with separate
services for authentication, notifications, and request management. It enables
users to log in with Google, create requests requiring superior approval, and
sends email notifications at each stage of the workflow.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Microservices](#microservices)
  - [Authentication Service](#authentication-service)
  - [Notification Service](#notification-service)
  - [Request Service](#request-service)
- [Frontend Components](#frontend-components)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)

## Overview

This application fulfills a task challenge to develop a React and Node.js
application with three microservices:

1. **Authentication Service**: Handles Google SSO and JWT-based authentication.
2. **Notification Service**: Sends email notifications for login, logout,
   request creation, and approval/rejection.
3. **Request Service**: Manages requests with properties like title,
   description, type, urgency, and status.

## Features

1. **Google SSO Login/Logout**: Secure login and logout via Google OAuth.
2. **Dashboard**: Customizable dashboard for users and their superiors to manage
   requests.
3. **Email Notifications**: Automatic email notifications for login, logout, and
   request status updates.
4. **Request Management**: Users can create, view, and update request statuses.

## Technologies Used

- **Frontend**: React, Material-UI for styling, React Router for navigation
- **Backend**: Node.js, Express.js
- **Microservices**: Each service has its own server and responsibilities
- **Database**: MongoDB (for storing requests)
- **Authentication**: Google OAuth2, JWT
- **Email**: Nodemailer for sending notifications

## Microservices

### 1. Authentication Service

- **Location**: `auth-service`
- **Purpose**: Verifies Google OAuth tokens, generates JWTs for users, and
  handles secure authentication.
- **Endpoints**:
  - `POST /verify-token`: Validates Google token and issues a JWT.

### 2. Notification Service

- **Location**: `notification-service`
- **Purpose**: Sends email notifications for login, logout, request creation,
  and approvals.
- **Endpoints**:
  - `POST /send-email`: Sends an email to specified recipients.

### 3. Request Service

- **Location**: `request-service`
- **Purpose**: Manages user requests and their statuses (Pending, Approved,
  Rejected).
- **Endpoints**:
  - `GET /get-requests`: Retrieves requests for logged-in user or their
    superior.
  - `POST /create-request`: Allows users to create new requests.
  - `POST /approve-request/:id`: Allows superiors to approve requests.
  - `POST /reject-request/:id`: Allows superiors to reject requests.

## Frontend Components

- **App.js**: Sets up routing, authentication, and global state contexts.
- **Login**: Google login and error handling.
- **Dashboard**: Main interface for request management, including creating,
  viewing, and updating request statuses.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kamalbhaiii/Belzir-Project.git
   cd Belzir-Project
   ```

2. **Environment Setup**:

   - Create `.env` files in each service directory.
   - Add the following variables:

     #### `auth-service/.env`

     ```plaintext
     GOOGLE_CLIENT_ID=<Your Google Client ID>
     JWT_SECRET=<Your JWT Secret>
     ```

     #### `notification-service/.env`

     ```plaintext
     EMAIL=<Your Gmail address>
     EMAIL_PASSWORD=<Your Gmail password>
     ```

     #### `request-service/.env`

     ```plaintext
     MONGO_URI=<Your MongoDB connection URI>
     JWT_SECRET=<Your JWT Secret>
     ```

     #### `frontend/.env`

     ```plaintext
     REACT_APP_GOOGLE_CLIENT_ID=<Your Google Client ID>
     REACT_APP_AUTH_SERVICE_URL=http://localhost:3001
     REACT_APP_NOTIFICATION_SERVICE_URL=http://localhost:3002
     REACT_APP_REQUEST_SERVICE_URL=http://localhost:3003
     ```

3. **Install Dependencies**:

   - For each service, navigate to its directory and install dependencies:

   ```bash
   npm install
   ```

4. **Run Microservices**:

   - Start each service in separate terminal tabs/windows:

   ```bash
   # Start Auth Service
   cd auth-service
   npm start

   # Start Notification Service
   cd notification-service
   npm start

   # Start Request Service
   cd request-service
   npm start
   ```

5. **Run Frontend**:
   ```bash
   cd frontend
   npm start
   ```

## Usage Guide

1. **Login**:

   - Users can log in with Google. Upon successful login, an email notification
     is sent.

2. **Create Request**:

   - Fill in request details (title, description, type, urgency, and superior's
     email).
   - On submission, the requester and their superior receive notification
     emails.

3. **Approve/Reject Request**:

   - The superior logs in to view requests, approve/reject them, and trigger
     email notifications.

4. **View Request Status**:
   - Requesters can log in to check the status of their requests.

---

This documentation provides a full guide for setup, configuration, and usage of
the Belzir Project.
