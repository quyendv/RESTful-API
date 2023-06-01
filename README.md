# BookStore

A simple RESTful API application about books.

> Tutorial: [Tự học NodeJS - hip06](https://www.youtube.com/watch?v=gjGVE0jdj3o&list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu)

## Tech Stack

**Server:** Node, Express, MySQL with ORM Sequelize, Cloudinary

## Lessons Learned

- Login, Register API
- Validate client data (Joi)
- Create accessToken, refreshToken flow with jsonwebtoken
- VerifyToken, verifyRoles (for Authentication & Authorization)
- Config & connect MySQL by Sequelize
- Handle upload, update, destroy file with Cloudinary
- Create CRUD api about book (title, price, category, available, image, description, ...)

## Updating Features

- OAuth with Google, Facebook, ...
- Build FrontEnd for application.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`CLIENT_URL`

`DB_USERNAME`

`DB_PASSWD`

`DB_DATABASE`

`DB_HOST`

`JWT_SECRET`

`JWT_SECRET_REFRESH_TOKEN`

`LIMIT_BOOK`

`CLOUDINARY_NAME`

`CLOUDINARY_KEY`

`CLOUDINARY_SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/quyendv/learn-it-MernApp.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies and start the server

```bash
  npm install && npm run dev
```

## API Reference

- See details at `/api.rest`

### Example

- Get list books and search by queries

```http
  GET /api/v1/book?
```

| Parameter     | Type     | Description                                  |
| :------------ | :------- | :------------------------------------------- |
| `order`       | `array`  | **Optional** Order by [field, asc/desc]      |
| `page`        | `number` | **Optional** Skip page                       |
| `limit`       | `number` | **Optional** Limit books per page            |
| `name`        | `string` | **Optional** Substring in title book         |
| `available`   | `array`  | **Optional** Number of books still available |
| `...otherKey` |          |                                              |
