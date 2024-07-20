# Comments API

This project is a RESTful API for managing comments. It is built with [NestJS](https://nestjs.com/) and uses a SQL Server database. The API allows for creating, retrieving, updating, and deleting comments, with additional security features to protect against common web vulnerabilities.

## Features

- Create, retrieve, update, and delete comments
- Protection against Cross-Site Request Forgery (CSRF)
- Security headers using Helmet
- Input sanitization to prevent XSS attacks

## Prerequisites

- docker

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/basouzars/comments-api.git
   cd comments-api
   ```

2. Run docker:
   ```bash
   git clone https://github.com/basouzars/comments-api.git
   cd comments-api
   ```

bash
Copy code
yarn build
yarn start:prod
Usage
API Endpoints
POST /comments - Create a new comment
GET /comments - Retrieve all comments
GET /comments/:id - Retrieve a comment by ID
PUT /comments/:id - Update a comment by ID
DELETE /comments/:id - Delete a comment by ID
Security Features
CSRF Protection: The API uses CSRF tokens to protect against Cross-Site Request Forgery attacks.
Security Headers: Helmet is used to set various HTTP headers for security.
Input Sanitization: User input is sanitized to prevent XSS attacks.
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.
