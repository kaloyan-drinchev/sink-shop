# Sink Shop Backend API

A full-featured REST API for the Sink Shop e-commerce platform with PostgreSQL support.

## Features

- **Product Management** - CRUD operations for sink products
- **User Authentication** - JWT-based auth with registration/login
- **Shopping Cart** - Persistent cart with user sessions  
- **Order Management** - Complete order processing workflow
- **Admin Dashboard** - Administrative controls and analytics
- **Payment Integration** - Stripe payment processing
- **PostgreSQL Ready** - Database schemas and migrations prepared

## Quick Start

```bash
# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products (supports ?category=)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart (requires auth)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders (requires auth)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create order from cart

### Admin (requires admin role)
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/orders/:id/status` - Update order status

## Environment Variables

```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/sinkshop
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
USE_MOCK_DATA=true
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

## PostgreSQL Migration

When ready to connect to PostgreSQL:

1. Set `USE_MOCK_DATA=false` in .env
2. Update `DATABASE_URL` with your PostgreSQL connection
3. Run migrations: `npm run db:migrate`
4. Seed initial data: `npm run db:seed`

## Mock Data

Currently using in-memory mock data that mimics PostgreSQL structure. Data includes:
- Sample sink products (wooden, marble, natural stone)
- Admin user (admin@sinkshop.com / admin123)
- Complete cart and order workflows

## Default Admin Account

- **Email**: admin@sinkshop.com  
- **Password**: admin123
- **Role**: admin

Change this immediately in production!
