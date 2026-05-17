# Freeze Dry Backend - API Testing Guide for Postman

Yeh guide aapko Postman par manually APIs test karne mein madad karegi. Apna server lazmi chalu rakhein (`npm run dev`). Base URL apka `http://localhost:3001` hai.

---

## 1. 🗂️ Categories (Public)

### Get All Categories
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/categories`
- **Body:** None

### Get Single Category by Slug
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/categories/fruits` *(fruits ki jagah koi bhi category slug dalen)*
- **Body:** None

---

## 2. 📦 Products (Public)

### Get All Products
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/products`
- **Body:** None

### Search Products
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/products?search=apple`
- **Body:** None

### Get Single Product
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/products/PRODUCT_ID_HERE` *(Asli ID se replace karein)*
- **Body:** None

---

## 3. 🛒 Orders (Public)

### Create New Order
- **Method:** `POST`
- **URL:** `http://localhost:3001/api/orders`
- **Body (raw -> JSON):**
```json
{
  "customerName": "Ali",
  "customerPhone": "03001234567",
  "customerAddress": "Karachi",
  "totalAmount": 150,
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "nameAr": "اسم المنتج",
      "nameEn": "Product Name",
      "price": 75,
      "qty": 2
    }
  ]
}
```

### Check Order Receipt
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/orders/ORDER_ID_HERE`
- **Body:** None

---

## 4. ⚙️ Settings (Public)

### Get Website Settings
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/settings`
- **Body:** None

---
---

# 🔐 ADMIN APIs (Login Required)
**DHYAN DEN:** In sab APIs ke liye aapko pehle `Admin Login` wali API hit karni hai, wahan se jo `token` milega, wo baqi saari Admin APIs ke **Headers** mein aise dalna hoga:
`Authorization` : `Bearer AAPKA_TOKEN_YAHAN`

---

## 🔑 Auth (Admin Login)

### Admin Login (Token lene ke liye)
- **Method:** `POST`
- **URL:** `http://localhost:3001/api/admin/login`
- **Body (raw -> JSON):**
```json
{
  "username": "admin",
  "password": "freezedry2025"
}
```

### Verify Token (Check current admin)
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/admin/me`
- **Headers:** `Authorization` : `Bearer <TOKEN>`

---

## 📦 Admin Products

### Get All Admin Products (Hidden wale bhi)
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/admin/products`
- **Headers:** `Authorization` : `Bearer <TOKEN>`

### Create Product
- **Method:** `POST`
- **URL:** `http://localhost:3001/api/admin/products`
- **Headers:** `Authorization` : `Bearer <TOKEN>`
- **Body (form-data):**
  - Key: `nameEn`, Value: `Mango`
  - Key: `nameAr`, Value: `مانجو`
  - Key: `price`, Value: `200`
  - Key: `isVisible`, Value: `true`
  - Key: `category`, Value: `CATEGORY_ID`
  - Key: `images` (Type File karo), aur tasveer upload karo.

### Update Product
- **Method:** `PUT`
- **URL:** `http://localhost:3001/api/admin/products/PRODUCT_ID`
- **Body (form-data):** Jese create mein kya tha wesay hi new data bhejain.

### Toggle Visibility (Hide/Show)
- **Method:** `PATCH`
- **URL:** `http://localhost:3001/api/admin/products/PRODUCT_ID/visibility`
- **Headers:** `Authorization` : `Bearer <TOKEN>`

### Delete Product
- **Method:** `DELETE`
- **URL:** `http://localhost:3001/api/admin/products/PRODUCT_ID`
- **Headers:** `Authorization` : `Bearer <TOKEN>`

---

## 🗂️ Admin Categories

### Create Category
- **Method:** `POST`
- **URL:** `http://localhost:3001/api/admin/categories`
- **Headers:** `Authorization` : `Bearer <TOKEN>`
- **Body (raw -> JSON):**
```json
{
  "nameEn": "Fruits",
  "nameAr": "فواكه",
  "slug": "fruits"
}
```

---

## 🛒 Admin Orders

### Get All Orders
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/admin/orders`
- **Headers:** `Authorization` : `Bearer <TOKEN>`

### Change Order Status
- **Method:** `PATCH`
- **URL:** `http://localhost:3001/api/admin/orders/ORDER_ID/status`
- **Headers:** `Authorization` : `Bearer <TOKEN>`
- **Body (raw -> JSON):**
```json
{
  "status": "DELIVERED"
}
```
*(Status options: PENDING, CONFIRMED, DELIVERED, CANCELLED)*

---

## ⚙️ Admin Settings

### Update Settings
- **Method:** `PUT`
- **URL:** `http://localhost:3001/api/admin/settings`
- **Headers:** `Authorization` : `Bearer <TOKEN>`
- **Body (raw -> JSON):**
```json
{
  "heroTextEn": "Welcome",
  "heroTextAr": "مرحباً",
  "shippingFee": 50,
  "freeShippingThreshold": 500
}
```
