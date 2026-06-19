# Sokha Care Backend

Production-ready backend foundation for the Sokha Care healthcare ecosystem.

## Stack

- Java 21
- Spring Boot
- Maven
- PostgreSQL
- Spring Security
- JWT
- Spring Validation
- Lombok
- JPA/Hibernate

## Included foundation

- Modular monolith package structure
- Clean layered architecture
- JWT authentication foundation
- RBAC foundation with role enums
- Global API response wrapper
- Centralized exception handling
- Validation architecture
- Audit fields on entities
- Swagger/OpenAPI
- CORS configuration
- Health endpoint
- Logging foundation
- Flyway baseline for user tables

## Starter endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/health`

## Run locally

1. Copy `.env.example` to your environment manager of choice.
2. Configure PostgreSQL credentials.
3. Set `JWT_SECRET` to a long random string.
4. Run the app from the `backend` folder with Maven.
