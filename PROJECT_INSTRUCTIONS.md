You are a senior full-stack software engineer.

I have an existing Next.js marketplace project. Your job is to transform it into a production-ready multi-vendor FMCG marketplace while preserving existing functionality whenever possible.

DO NOT rewrite the project from scratch unless absolutely necessary.
Refactor and improve the existing codebase.

=========================
GENERAL REQUIREMENTS
=========================

• Clean architecture
• Scalable folder structure
• TypeScript everywhere possible
• Responsive UI
• Modern dashboard
• Proper loading states
• Error handling
• Validation
• Reusable components
• Server-side security
• Production-ready code
• No placeholder pages
• Every feature must actually work

=========================
TECH STACK
=========================

Next.js (App Router)

React

TypeScript

Tailwind CSS

Prisma ORM

PostgreSQL

NextAuth/Auth.js (or JWT if already used)

Zod validation

React Hook Form

UploadThing or Cloudinary

TanStack Table

Recharts

Socket.io or Pusher for realtime

Stripe-ready payment architecture (keep existing payment methods)

=========================
ROLES
=========================

Implement RBAC:

Admin

Seller

Customer

Middleware should protect all routes.

=========================
SELLER ACCOUNT MANAGEMENT
=========================

Seller registration

Seller login

Forgot password

Email verification

Phone verification

2FA-ready architecture

Store creation

Store profile

Store logo

Store banner

Store description

Store address

Store hours

Delivery radius

Store status

Vacation mode

Bank account

Tax information

Store settings

Seller notifications

=========================
SELLER DASHBOARD
=========================

Dashboard showing:

Revenue

Today's sales

Weekly sales

Monthly sales

Pending orders

Completed orders

Cancelled orders

Recent orders

Sales graph

Top products

Low stock alerts

Customer statistics

=========================
PRODUCT MANAGEMENT
=========================

CRUD

Unlimited images

Categories

Subcategories

Brands

Variants

Sizes

Colors

Weight

Volume

SKU

Barcode

Cost price

Sale price

Discount price

Inventory

Featured products

Draft products

Hidden products

SEO fields

Bulk import CSV

Bulk export CSV

=========================
INVENTORY
=========================

Inventory tracking

Automatic stock deduction

Low stock notifications

Restock history

Inventory logs

=========================
ORDER MANAGEMENT
=========================

Order lifecycle:

Pending

Accepted

Preparing

Ready

Out for delivery

Delivered

Cancelled

Refunded

Order timeline

Order notes

Customer info

Payment status

Delivery status

Invoice generation

=========================
CUSTOMER FEATURES
=========================

Registration

Login

Profile

Saved addresses

Wishlist

Favorites

Order history

Reorder

Wallet

Notifications

Recently viewed

Reviews

Ratings

=========================
SEARCH
=========================

Global search

Autocomplete

Category filter

Brand filter

Price filter

Rating filter

Availability filter

Nearby stores

Sorting

=========================
REVIEWS
=========================

Product reviews

Seller reviews

Photos

Seller replies

Rating analytics

=========================
PROMOTIONS
=========================

Coupons

Promo codes

Percentage discounts

Fixed discounts

BOGO

Bundles

Flash sales

Scheduled discounts

=========================
NOTIFICATIONS
=========================

Realtime notifications

Email notifications

Order updates

Stock alerts

Promotion alerts

=========================
DELIVERY
=========================

Delivery zones

Delivery fees

ETA calculation

Delivery settings

Tracking

=========================
ANALYTICS
=========================

Revenue

Orders

Customers

Products

Conversion

Top sellers

Top products

Traffic

Graphs

Reports

CSV export

=========================
ADMIN PANEL
=========================

Dashboard

Manage sellers

Manage customers

Manage orders

Manage products

Manage categories

Manage brands

Manage coupons

Approve sellers

Suspend sellers

Analytics

Platform settings

Audit logs

=========================
STAFF MANAGEMENT
=========================

Seller staff accounts

Permissions

Manager

Employee

Inventory manager

Support agent

=========================
CHAT
=========================

Realtime customer ↔ seller chat

Image support

Read receipts

Order attachments

=========================
PAYMENTS
=========================

Keep current payments working.

Architecture should support:

Stripe

PayPal

Cash on Delivery

Wallet

Refunds

Seller payouts

=========================
SECURITY
=========================

Rate limiting

CSRF

XSS protection

SQL injection protection

Secure authentication

RBAC

Input validation

Image validation

Audit logs

=========================
PERFORMANCE
=========================

Lazy loading

Image optimization

Caching

Pagination

Infinite scrolling where appropriate

Database indexing

=========================
UI/UX
=========================

Beautiful dashboards

Dark mode

Light mode

Animations

Skeleton loading

Toast notifications

Mobile responsive

Accessibility

=========================
DATABASE
=========================

Update Prisma schema

Create migrations

Seed database

Relationships

Indexes

Constraints

=========================
PROJECT STRUCTURE
=========================

Refactor into:

app/

components/

features/

lib/

hooks/

types/

services/

server/

prisma/

utils/

=========================
DOCUMENTATION
=========================

Generate:

README

Installation guide

Environment variables

Deployment instructions

Database setup

=========================
IMPORTANT
=========================

Do NOT leave TODOs.

Do NOT leave placeholder pages.

Every button should function.

Every page should be connected to backend logic.

Every API should be implemented.

Every form should validate.

Maintain existing functionality.

Fix any bugs encountered.

Refactor poor code where necessary.

When complete:

1. Ensure the project builds without errors.

2. Run linting.

3. Fix TypeScript issues.

4. Remove dead code.

5. Optimize performance.

6. Return the complete updated project.
