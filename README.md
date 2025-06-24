# Warehouse – Intelligent Supply Chain Management System

A smart inventory and procurement platform for rural institutions (schools, anganwadis, clinics) in India.

## Features

- Real-time inventory tracking
- Seller product listing
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

## Business Model Suggestions

- **Subscription**: Institutions pay a monthly fee for premium analytics.
- **Transaction Fee**: Small commission on each procurement.
- **Seller Ads**: Sellers pay for featured listings.
- **Data Insights**: Sell anonymized demand data to sellers/government.

## Getting Started

1. `cd backend && npm install && npm run dev`
2. `cd frontend && npm install && npm start`

## Seed Data

See `backend/seed/` for sample users and products.

## Test User Accounts

Use these accounts to log in and test the system:

- **Admin**
  - Email: admin@example.com
  - Password: password
- **Seller**
  - Email: seller1@example.com
  - Password: password
- **Buyer**
  - Email: buyer1@example.com
  - Password: password

## User Roles & Permissions

### Buyer
- View all available products and their details
- Search/filter products by name
- Raise purchase requests for available products
- View and track status of their own requests in the "My Purchase Requests" tab
- Rate products after their purchase request is approved (from the requests tab only)
- See product ratings and analytics

### Seller
- Add new products with all details
- View and manage their own products
- See requests for their products and approve/reject them
- View notifications for request status changes
- See product KPIs and analytics for their own products

### Admin
- View all products and all purchase requests
- See analytics and KPIs for the entire system
- Cannot approve/reject requests

## Product Ratings
- Buyers can rate products only after their purchase request is approved (from the requests tab)
- Product ratings are displayed in the product list for all roles
- Ratings update in real-time after each new rating

## FAQ

For frequently asked questions, please refer to the [FAQ.md](FAQ.md) file.

## Business Problem & Solution

**Problem:**
Rural institutions (schools, clinics, anganwadis) often face challenges with manual, paper-based supply chain processes. This leads to delays, stockouts, lack of transparency, and inefficient procurement, making it hard to track inventory, manage sellers, and make data-driven decisions.

**Solution:**
This platform digitizes and streamlines the entire supply chain process:
- Provides real-time inventory tracking and product management.
- Enables buyers to request products and track their status.
- Allows sellers to add/manage products and handle requests efficiently.
- Gives admins full visibility into all products, requests, and analytics.
- Automates notifications, approvals, and analytics (KPIs, demand forecasting).
- Supports seller onboarding and approval for quality control.
- Includes a chatbot for user support and platform guidance.
- Ensures a user-friendly, responsive interface for all roles.

## User Roles & Responsibilities

### Buyer
- Search and view available products.
- Raise purchase requests for products in stock.
- Track the status of their requests and receive notifications.
- Rate products after approved purchase.
- Use analytics to make informed decisions.

### Seller
- Register and get approved by admin before selling.
- Add, update, and manage their own products.
- View and respond to purchase requests for their products (approve/reject).
- Receive notifications for new requests and status changes.
- Monitor KPIs and analytics for their products.

### Admin
- Approve new seller registrations.
- View all products and all purchase requests in the system.
- Access analytics and KPIs for the entire platform.
- Cannot approve/reject individual product requests (handled by sellers).

## Space for Improvement

- Integrate advanced analytics (e.g., seller performance, cost analysis, inventory turnover)
- Add shipment/delivery tracking and notifications
- Implement multi-level approval workflows for high-value requests
- Enable seller/buyer chat or messaging
- Add self-service password reset and user profile management
- Support document uploads (invoices, certificates)
- Integrate with payment gateways for procurement
- Add automated tests (unit, integration, end-to-end)
- Deploy with CI/CD pipelines for automated updates
- Enhance chatbot with more AI capabilities or multilingual support
- Improve accessibility and add more user training/help resources

