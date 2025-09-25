# 🕰️ Watch Store

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://whatwatch-w8or.vercel.app/)

A full-stack e-commerce project for selling watches.  
**Live Demo:**  [whatwatch-w8or.vercel.app](https://whatwatch-w8or.vercel.app/)  
**GitHub Repo:**  [bantest04/Watch-main](https://github.com/bantest04/Watch-main)

---

##  Features
-  Product listing, search, filter, details  
-  User authentication (register, login, profile)  
-  Shopping cart & checkout flow  
-  Order history tracking  
-  Admin panel: product & order management  
-  Responsive UI (mobile-first)

---

##  Tech Highlights
- **Frontend:** Next.js (App Router), React 18, Tailwind CSS, Axios/fetch  
- **Backend:** Node.js + Express, REST API design  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT (access + refresh tokens)  
- **Deployment:** Frontend on Vercel, backend ready for Render/Heroku deployment  
- **Optimization:** SEO, lazy loading, Next/Image for performance

---

##  Architecture
Frontend (Next.js) ──► REST API (Express) ──► MongoDB
Admin Dashboard ────► same API

---

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env
# set MONGODB_URI, JWT secrets
npm run dev
Frontend

cd frontend
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE=http://localhost:4000
npm run dev  # http://localhost:3000
Admin (optional)

cd admin
npm install
cp .env.example .env
npm run dev  # http://localhost:5173

## API Examples
POST /api/auth/login → login user

GET /api/products → list products

GET /api/products/:id → product details

POST /api/cart → add to cart

POST /api/orders → create new order

GET /api/orders/me → user’s order history

POST /api/admin/products → add new product (admin)

## Example Code
Create order (Express route)

js

router.post("/orders", requireAuth, async (req, res) => {
  const { items, total } = req.body;
  const order = await Order.create({ userId: req.user.id, items, total });
  res.status(201).json(order);
});
Fetch products (React / Next.js)

jsx

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`)
    .then(r => r.json())
    .then(setProducts);
}, []);

## Roadmap
- Product image upload (Cloudinary/S3)

- Payment integration (Stripe, PayPal, MoMo/VNPay)

- Email/SMS notifications

- Admin analytics dashboard


