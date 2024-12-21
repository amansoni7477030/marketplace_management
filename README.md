# Marketplace Management System

## Introduction

The **Marketplace Management System** is a platform that allows both sellers and customers to manage their respective activities in an online marketplace. It is built using **Flask** for the backend, **React** for the frontend, and **SQLAlchemy** for database management. The system facilitates the following functionalities:

- **Sellers**: Create shops, add items, manage inventory, and delete shops and items.
- **Customers**: Browse items, add items to their cart, update their cart, and purchase items.

The backend utilizes **Flask**, with JWT authentication for secure login and role-based access control. The frontend, built with **React**, provides an interactive user interface for both sellers and customers.

The system is structured to provide an easy-to-use interface and robust backend services for managing products, shops, and user profiles.

---

## Prerequisites

Before running the system, ensure the following tools and technologies are installed on your system:

- **Python 3.11.5**: Backend is built with Python 3.11.5. Download it from the [official Python website](https://www.python.org/downloads/).
- **Node.js and npm**: For managing frontend dependencies. Download it from [Node.js official site](https://nodejs.org/).
- **PostgreSQL** (or SQLite for development): Backend uses PostgreSQL or SQLite as the database.
- **Git**: For version control and code management. Download it from [Git official site](https://git-scm.com/).

---

# Main Setup
```bash
git clone https://github.com/amansoni7477030/marketplace_management.git
cd Marketplace_System_Backend
```
---
## Backend Setup

### Go to Backend folder

```bash
cd Marketplace_System_Backend
```

### Create a Virtual Environment
It is recommended to use a virtual environment to avoid conflicts with system-wide packages.

```bash
python3 -m venv venv
```

### Activate the Virtual Environment
On macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

### Install Backend Dependencies
Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### Set Up Environment Variables
Create a `.env` file in the root directory of the backend folder to store sensitive information like database credentials and secret keys:

```ini
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
JWT_SECRET_KEY=your_jwt_secret_key
```

For local development, the `DATABASE_URL` can be set to use SQLite:

```ini
DATABASE_URL=sqlite:///marketplace.db
```

### Initialize the Database
Set up the database and apply migrations:

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Run the Backend
Finally, run the backend server:

```bash
python app.py
```

The backend will be running at [http://localhost:5000](http://localhost:5000).

---

## Frontend Setup

### Navigate to the Frontend Directory
Change to the frontend directory:

```bash
cd Marketplace_System_Frontend
```

### Install Frontend Dependencies
Use npm to install the required dependencies:

```bash
npm install
```
### Configure the API URL
In the frontend, make sure that API requests point to the backend server URL. You can set this in a .env file (inside the frontend project folder):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```
### Run the Frontend
Start the React development server:

```bash
npm start
```

The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

---
# Backend API Endpoints

## Authentication
- **POST /api/register** — Register a new user (both Seller and Customer roles).
- **POST /api/login** — Login with email and password and receive a JWT token.
- **GET /api/user/profile** — Get user profile data (Requires JWT).

## Seller Endpoints
- **GET /api/shops** — Get all shops for the logged-in seller.
- **POST /api/shops** — Create a new shop (Requires seller role).
- **POST /api/shops/<shop_id>/items** — Add an item to a shop (Requires seller role).
- **PUT /api/items/<item_id>** — Update an item (Requires seller role).
- **DELETE /api/items/<item_id>** — Delete an item (Requires seller role).
- **DELETE /api/shops/<shop_id>** — Delete a shop (Requires seller role).

## Customer Endpoints
- **GET /api/items** — Get all items available in the marketplace (Requires no login).
- **POST /api/cart/items** — Add an item to the customer’s cart (Requires customer role).
- **GET /api/cart** — View the customer's cart (Requires customer role).
- **PUT /api/cart/items/<item_id>** — Update the quantity of an item in the cart (Requires customer role).
- **DELETE /api/cart/items/<item_id>** — Remove an item from the cart (Requires customer role).


---
# Conclusion
This Marketplace Management System allows sellers to manage their products and shops, while customers can shop and manage their carts efficiently. The backend is structured with Flask and SQLAlchemy, and the frontend is built with React for a modern user interface. By following the setup instructions provided, you can run the complete system locally for development and testing purposes.