# Node.js Monolithic Server Template

🚀 Production-ready Node.js monolithic server template with Express, Sequelize, and JWT authentication.

## ✨ Features

- 🏗️ **Feature-first architecture** - Organized by domain/feature
- 🔐 **JWT Authentication** - Secure token-based auth
- 🗄️ **Sequelize ORM** - PostgreSQL with Supabase support
- 🛡️ **Security** - Helmet, CORS, rate limiting
- 📝 **Error Handling** - Centralized error handling
- ✅ **Validation** - Request validation middleware
- 📊 **Logging** - Structured logging utility
- 🔄 **Graceful Shutdown** - Proper cleanup on termination

## 📁 Project Structure

```
src/
├── config/          # Database configuration
├── features/        # Feature modules (users, products)
│   ├── users/       # User feature (auth, JWT)
│   └── products/    # Product feature
├── shared/          # Shared resources
│   ├── middleware/  # Shared middleware
│   ├── utils/       # Utility functions
│   └── constants/   # Constants
├── models/          # Sequelize models index
├── routes/          # Route registration
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## 🔄 Request Flow Architecture

Understanding how requests flow through the application layers:

```
HTTP Request
    ↓
┌─────────────────────────────────────────────────────────┐
│ 1. Express Middleware (app.js)                         │
│    - Helmet (security headers)                          │
│    - CORS                                               │
│    - Body parsing                                       │
│    - Request logging                                    │
│    - Rate limiting                                      │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Routes (routes/index.js)                           │
│    - Route registration                                 │
│    - Maps URL to feature routes                        │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Feature Routes (features/*/feature.routes.js)       │
│    - Defines endpoints                                  │
│    - Applies middleware (auth, rate limit, validators)  │
│    - Routes to controller                              │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Validators (features/*/feature.validators.js)       │
│    - Validates request body/params                      │
│    - Returns 400 if validation fails                   │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Auth Middleware (shared/middleware/auth.js)         │
│    - Verifies JWT token                                 │
│    - Adds user info to req.user                        │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Controller (features/*/feature.controller.js)      │
│    - Handles HTTP request/response                     │
│    - Extracts data from req                            │
│    - Calls service layer                               │
│    - Formats response                                   │
│    - Handles errors (passes to error handler)          │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Service (features/*/feature.service.js)            │
│    - Business logic                                     │
│    - Data transformation                                │
│    - Calls model layer                                  │
│    - Throws errors with statusCode                      │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Model (features/*/feature.model.js)                 │
│    - Sequelize model definition                         │
│    - Database queries                                  │
│    - Data validation                                    │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Database (PostgreSQL via Sequelize)                 │
│    - Executes SQL queries                               │
│    - Returns data                                       │
└─────────────────────────────────────────────────────────┘
    ↓
Response flows back up through layers
    ↓
┌─────────────────────────────────────────────────────────┐
│ Error Handler (shared/middleware/errorHandler.js)      │
│    - Catches all errors                                 │
│    - Formats error response                             │
│    - Returns appropriate HTTP status                   │
└─────────────────────────────────────────────────────────┘
    ↓
HTTP Response
```

### Example: Creating a Product

```
POST /api/products
    ↓
1. app.js middleware (CORS, body parsing, rate limit)
    ↓
2. routes/index.js → routes to /api/products
    ↓
3. product.routes.js → POST / → authenticateToken middleware
    ↓
4. authenticateToken → verifies JWT, adds req.user
    ↓
5. validateCreateProduct → validates name, price, stock
    ↓
6. product.controller.createProduct → extracts req.body, calls service
    ↓
7. product.service.createProduct → business logic, calls model
    ↓
8. Product.create() → Sequelize creates record in database
    ↓
9. Database returns created product
    ↓
10. Response flows back: Model → Service → Controller → HTTP Response
```

### Key Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **Error Handling**: Errors bubble up and are caught by error handler
- **Validation**: Input validation happens before business logic
- **Authentication**: Protected routes verify JWT before processing
- **Business Logic**: Lives in service layer, not controller

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
# or explicitly set production environment
npm run prod
```

## 📡 API Endpoints

### Authentication (Users)

| Method | Endpoint              | Description              | Auth Required |
| ------ | --------------------- | ------------------------ | ------------- |
| POST   | `/api/users/register` | Register new user        | No            |
| POST   | `/api/users/login`    | Login user               | No            |
| GET    | `/api/users/profile`  | Get current user profile | Yes           |
| GET    | `/api/users`          | List all users           | Yes           |

### Products

| Method | Endpoint            | Description       | Auth Required    |
| ------ | ------------------- | ----------------- | ---------------- |
| POST   | `/api/products`     | Create product    | Yes              |
| GET    | `/api/products`     | List products     | Yes              |
| GET    | `/api/products/:id` | Get product by ID | Yes              |
| PUT    | `/api/products/:id` | Update product    | Yes (owner only) |
| DELETE | `/api/products/:id` | Delete product    | Yes (owner only) |

### Health Check

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Server health check |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example: Register and Login

```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Create Product (with token)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 10
  }'
```

## 🛠️ Technologies

- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** (Supabase) - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - HTTP security
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

## 📋 Environment Variables

| Variable         | Description                  | Required | Default     |
| ---------------- | ---------------------------- | -------- | ----------- |
| `PORT`           | Server port                  | No       | 3000        |
| `HOST`           | Server host                  | No       | 0.0.0.0     |
| `NODE_ENV`       | Environment                  | No       | development |
| `DATABASE_URL`   | PostgreSQL connection string | Yes      | -           |
| `JWT_SECRET`     | JWT secret key               | Yes      | -           |
| `JWT_EXPIRES_IN` | JWT expiration               | No       | 7d          |
| `CORS_ORIGIN`    | CORS allowed origin          | No       | \*          |

## 🏗️ Adding a New Feature

1. Create feature directory in `src/features/`:

```bash
mkdir -p src/features/myfeature
```

2. Create feature files:

   - `myfeature.model.js` - Sequelize model
   - `myfeature.service.js` - Business logic
   - `myfeature.controller.js` - HTTP handlers
   - `myfeature.routes.js` - Route definitions
   - `myfeature.validators.js` - Validation middleware

3. Register model in `src/models/index.js`
4. Register routes in `src/routes/index.js`

## 🔒 Security Best Practices

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Rate limiting on API endpoints
- ✅ Helmet for HTTP security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection protection (Sequelize)

## 📝 Code Style

- Double quotes for strings
- Semicolons
- 2-space indentation
- ES6+ modules
- JSDoc comments for functions

## 🚢 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` with production database
3. Set strong `JWT_SECRET`
4. Configure `CORS_ORIGIN` for your frontend domain

### Recommended Platforms

- **Railway** - Easy PostgreSQL + Node.js deployment
- **Render** - Simple deployment with PostgreSQL
- **Heroku** - Classic platform with add-ons
- **DigitalOcean** - VPS with Docker support

## 📚 Next Steps

- [ ] Add Sequelize migrations for production
- [ ] Add unit and integration tests
- [ ] Implement refresh tokens
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add request logging middleware
- [ ] Implement pagination
- [ ] Add file upload support
- [ ] Set up CI/CD pipeline

## 📄 License

ISC

## 🤝 Contributing

This is a template - feel free to fork and customize for your needs!
