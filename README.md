# Freeze Dry Backend API

Production-ready Node.js/Express backend for the Freeze Dry luxury confectionery e-commerce platform.

## Features
- **Bilingual Support**: Full Arabic/English support for all content.
- **Arabic Search**: Normalized search for better Arabic text matching.
- **Security**: JWT authentication, Helmet, CORS, and Rate Limiting.
- **Image Optimization**: Auto-compression to WebP format using Sharp.
- **Validation**: Strict request validation using Joi and Mongoose schemas.
- **Deployment**: Docker-ready with `Dockerfile` and `docker-compose.yml`.

## Tech Stack
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT & bcryptjs
- **Processing**: Multer & Sharp
- **Validation**: Joi

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=freezedry2025
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
CORS_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Initial Data
Run the seed script to create the initial admin user, categories, and sample products:
```bash
npm run seed
```

### 4. Run the Server
**Development Mode (with nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## API Documentation

### Public Endpoints
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Category details + products
- `GET /api/products` - List products (supports `?category`, `?search`, `?page`, `?limit`)
- `GET /api/products/:id` - Single product details
- `POST /api/orders` - Create a new order
- `GET /api/settings` - Public store settings

### Admin Endpoints (Requires JWT Bearer Token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - Full product list
- `POST /api/admin/products` - Create product (multipart/form-data)
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/settings` - Update store settings
- `POST /api/admin/reset` - Factory reset (deletes products/orders/categories)

## Docker Deployment
```bash
docker-compose up --build
```
