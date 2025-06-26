# Warehouse – Intelligent Supply Chain Management System

A smart inventory and procurement platform for rural institutions (schools, anganwadis, clinics) in India.

## Features

- Real-time inventory tracking
- Seller product listing (add, edit, manage)
- Buyer purchase requests
- Demand forecasting (AI/ML mock)
- Role-based access (Seller, Buyer, Admin)
- JWT authentication
- Scalable MongoDB backend

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- ML: Simple moving average (mock)

## Getting Started

1. `cd backend && npm install && npm run dev`
2. `cd frontend && npm install && npm start`

## Test User Accounts

- **Admin**: admin@example.com / password
- **Seller**: seller1@example.com / password
- **Buyer**: buyer1@example.com / password

## User Roles

- **Buyer**: View/search products, request, track, rate after approval, see analytics.
- **Seller**: Add/edit/manage products, approve/reject requests, see notifications & analytics.
- **Admin**: View all products/requests, see analytics. Cannot add/edit products or approve/reject requests.

## Product Ratings

- Buyers can rate products after approved purchase. Ratings are visible to all roles and update in real-time.

## Business Model Suggestions

- Subscription, transaction fee, seller ads, data insights.

## Space for Improvement

- Advanced analytics, shipment tracking, approval workflows, chat, password reset, document uploads, payments, automated tests, CI/CD, better chatbot, accessibility.

## FAQ

See [FAQ.md](FAQ.md) for more.

