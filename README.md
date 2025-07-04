# 🛒 Simple Inventory Management (React + Laravel)

A **simple inventory management system** built using **Laravel (backend)** and **React (frontend)**. This project is created primarily to **practice React integration** with Laravel and simulate a small-scale e-commerce workflow for learning purposes.

> ⚠️ **Note:** This project is still **under development**. Some functionalities may not be fully complete as it is currently used for testing and learning **React with Laravel integration**.

---

## ✨ Features

✅ **Admin:**
- Add, edit, and delete products.
- View customer orders.
- Manage product listings.

✅ **User:**
- Browse products.
- Add to cart.
- Checkout using **Stripe**.
- View order history.

---

## 📸 Screenshots

- ### 🏠 Home
  ![Home](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Home.png?raw=true)

- ### 📦 Products Listing
  ![Products Listing](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Products%20Listing.png?raw=true)

- ### 🛒 Cart
  ![Cart](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Cart.png?raw=true)

- ### 💳 Stripe Checkout
  ![Stripe Checkout](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Stripe%20Checkout.png?raw=true)

- ### 📄 Orders Listing
  ![Orders Listing](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Orders%20Listing.png?raw=true)

- ### 👥 Customer Orders (Admin)
  ![Customer Orders](https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-/blob/main/Screenshorts/Customer%20Orders.png?raw=true)

---

## ⚙️ Tech Stack

- **Frontend:** React 18, Axios, TailwindCSS, Motion
- **Backend:** Laravel 12
- **Database:** MySQL
- **Payment Gateway:** Stripe (Test Mode)

---

## 🎯 Purpose

This project was built:
✅ To **practice React with Laravel** integration.  
✅ To understand **basic CRUD workflow** in a small e-commerce setup.  
✅ To simulate API calls, cart management, and checkout handling using **Stripe**.  
✅ As a **learning project for frontend and backend integration**.

---

## 🚀 Installation

### Backend (Laravel)
```bash
git clone https://github.com/aiymnn/Simple-Inventory-Management-React-Laravel-.git
cd Simple-Inventory-Management-React-Laravel-
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
