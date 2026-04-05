# Laced: Premium E-Commerce Platform 👟

A responsive, full-stack e-commerce web application built for premium footwear. Developed utilizing a decoupled architecture with a FastAPI Python backend and a React/Vite frontend. 

![Homepage screenshot](frontend/public/screenshots/homepage.jpg)

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Secure JWT authentication with dedicated views and permissions for Customers, Moderators, and Administrators.
* **Modern Responsive UI:** Mobile-first design utilizing Tailwind CSS, featuring adaptive navigation and dynamic art-direction for product displays.
* **Streamlined Checkout & Payments:** Secure payment processing integration with Stripe and Cash on Delivery (COD) options.
* **Automated Notifications:** Jinja2-templated email receipts sent securely via Mailtrap upon successful order placement.
* **Admin Dashboard:** Real-time business intelligence with client-side, one-click CSV export functionality for sales reports.
* **Community Driven:** An inline, dynamic product review system managed by community moderators.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
* **Framework:** React 18 + Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios

### Backend (API-Side)
* **Framework:** FastAPI (Python 3.10+)
* **Database:** Relational DB mapped with SQLAlchemy / Pydantic
* **Security:** JWT (JSON Web Tokens), Passlib (Bcrypt)
* **Integrations:** Mailtrap (Transactional Emails), Stripe API

---

## 📂 Project Structure

```text
├── backend/                # FastAPI application
│   ├── main.py             # Application entry point
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # React + Vite application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # Global state management
    │   ├── pages/          # Application views (e.g., Home, Checkout, Admin)
    │   └── api/            # Axios configurations
    └── package.json        # Node.js dependencies
```

## 🚀 Quick start

Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment
- Backend: Python 3.10+ (see `backend/requirements.txt`)
- Frontend: Node 16+ (Vite + React)



