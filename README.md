# 💹 Financial Analytics Dashboard – Full-Stack Web Application

> A dynamic, full-stack financial analytics platform designed for financial analysts to monitor, filter, and export transaction data with ease.  
> Built using **React**, **TypeScript**, **Tailwind CSS**, and **Node.js**, the application provides robust features like interactive visualizations, advanced filtering, configurable CSV export, and secure JWT authentication.

---

## 📊 Core Features

### 🔐 Authentication & Security

* JWT-based login/logout system  
* Secure RESTful APIs with middleware-based token validation  
* Auth-protected routes and API calls  

### 📈 Financial Dashboard

* **Summary Cards**: Revenue, Expenses, and Net Balance  
* **Charts**:
    * Revenue vs Expenses trend chart  
    * Category-wise spending breakdown (Pie/Bar)  
* **Responsive Transaction Table**:
    * Pagination  
    * Mobile/tablet/desktop optimization  
    * Error-handling with alert chips  
* **Data Interaction**:
    * Multi-field filtering (Date, Amount, Category, Status, User)  
    * Column-wise sorting with icons  
    * Real-time search  

### 📁 CSV Export System

* Column selection modal for user-defined export fields  
* Auto-download of CSV file post generation  
* Proper formatting with headers and UTF-8 compatibility  
* Seamless download via browser with no backend polling  

---

## 🧱 Tech Stack

### 🖥️ Frontend

* **React.js (v18)** + **TypeScript**  
* **Tailwind CSS** for styling  
* **Shadcn/UI** for components  
* **Recharts** for data visualization  
* **Axios** for API communication  
* **React Router v6** for routing  

### ⚙️ Backend

* **Node.js + Express (TypeScript)**  
* **MongoDB** with Mongoose  
* **JWT Authentication**  
* **CSV Generator** using `json2csv` or similar library  

---

## 📁 Sample Data Structure

{"_id":{"$oid":"6860fb4ad8811e8e70eb04bc"},"userId":"6860f5cc39f9d1455a46a627","date":{"$date":{"$numberLong":"1725934259000"}},"amount":{"$numberInt":"650"},"type":"income","category":"Salary","description":"Imported transaction #9","status":"completed","__v":{"$numberInt":"0"},"createdAt":{"$date":{"$numberLong":"1751186250967"}},"updatedAt":{"$date":{"$numberLong":"1751186250967"}}}

---

## 🚶 User Flow

1. **Login**: JWT-secured login using email and password  
2. **Dashboard**: View financial summaries, charts, and recent transactions  
3. **Interact**: Apply filters, search terms, and sort options  
4. **Export**: Configure CSV columns → click generate → download CSV  

---

## 🔐 API Endpoints

### 🧾 Authentication

| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/auth/login`   | Authenticate user  |
| GET    | `/api/auth/me`      | Get current user   |

### 💳 Transactions

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/transactions`     | List with filters & pag. |
| GET    | `/api/transactions/:id` | Get single transaction   |
| POST   | `/api/transactions`     | Create transaction       |
| PUT    | `/api/transactions/:id` | Update transaction       |
| DELETE | `/api/transactions/:id` | Delete transaction       |

### 📈 Dashboard

| Method | Endpoint                                     | Description                    |
|--------|----------------------------------------------|--------------------------------|
| GET    | `/api/dashboard/summary`                     | Revenue/expense/net stats      |
| GET    | `/api/dashboard/charts/revenue-expense`      | Line/bar chart data            |
| GET    | `/api/dashboard/charts/category-breakdown`   | Category-wise chart data       |

### 📁 CSV Export

| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/export/csv`   | Generate & auto-download CSV         |

---

## 🧪 Error Handling

* Alert chips used to display:
    * API errors (e.g., 401, 403, 500)  
    * Empty state messages  
    * Network or export issues  

---

## 🧰 Installation Guide

### ✅ Prerequisites

* Node.js v16+  
* MongoDB instance (local or cloud)  
* npm or yarn  

### ⚙️ Setup Instructions

1. Clone the repository
git clone https://github.com/jay-3107/loopr-project-code.git

2. Setup Backend
cd loopr-project-code/financial-api
npm install
npm run dev # Runs server on http://localhost:5000

3. Setup Frontend
cd ../financial-dashboard
npm install
npm run dev # Runs app on http://localhost:5173

yaml
Copy
Edit

---

## 📦 CSV Export Config UI

> ✨ A special modal interface allows users to select which fields (columns) they want to include in the CSV file.  
> CSV auto-download is triggered once the report is generated, enhancing UX.

---

## 📄 Documentation

* **README** – Setup, usage, and tech overview  
* **API Docs** – Full endpoint specs in `docs/api.md`  
* **Sample Data** – Provided in `sample_data.json`  

---
> Built using VS Code, GitHub, Postman, ChatGPT, and other tools  

---

## 👨‍💻 Contributors

* **Jayesh Vilas Wankhede** – [@jay-3107](https://github.com/jay-3107)
