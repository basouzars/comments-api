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

2. Run docker build:
   ```bash
   docker build .
   ```

## Usage:

1. Run docker compose:
   ```bash
   docker-compose up
   ```
2. Access localhost:3000/api

## Security Features

- Security Headers: Helmet is used to set various HTTP headers for security.
- Sanitizing comments: HTML sanitization is used in comments before saving to the database.

## Contributing

- Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
