# CRUD API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-orange.svg)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)](https://www.sqlite.org/)
[![Jest](https://img.shields.io/badge/Jest-29+-red.svg)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A RESTful API for user management built with Express.js, TypeScript, Prisma, and SQLite.

## ✨ Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ TypeScript for type safety
- ✅ Prisma ORM for database management
- ✅ SQLite database
- ✅ Comprehensive testing (Jest + Supertest)
- ✅ Automatic API documentation (Swagger/OpenAPI)
- ✅ Input validation and error handling

## 🛠 Tech Stack

- **Backend**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: SQLite with Prisma ORM
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Lefjuu/crud-app.git
cd crud-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up the database:**

```bash
npx prisma migrate dev
```

4. **Start the development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for interactive API documentation powered by Swagger.

## 📋 API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get user by ID    |
| POST   | `/api/users`     | Create a new user |
| PATCH  | `/api/users/:id` | Update user       |
| DELETE | `/api/users/:id` | Delete user       |

### Example Requests

#### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

#### Get All Users

```bash
curl http://localhost:3000/api/users
```

## 📁 Project Structure

```
crud-app/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── routes/
│   │   └── user.routes.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── __tests__/
│   │   ├── user.test.ts
│   │   └── user.service.test.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🗄️ Database Schema

```prisma
model User {
  id         Int      @id @default(autoincrement())
  name       String
  email      String   @unique
  age        Int?
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📜 Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run clean` - Clean build files and database

## 🔧 Environment Variables

The application uses the following environment variables:

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Database connection string (default: SQLite file)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Karol Legut**

- Student ID: 147653
- GitHub: [@Lefjuu](https://github.com/Lefjuu)
