# sokonear

---

# Ecommerce Project

This repository contains both the backend and frontend for an ecommerce application.  
The **backend** is built with Express, TypeScript, MongoDB, and Multer (for file uploads) and the **frontend** is built with React and Tailwind CSS.

> **Note:** This project is organized as a monorepo. The backend code is located in the `/backend` folder and the frontend code in the `/frontend` folder.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running Locally](#running-locally)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)



## Features

- User authentication (login/signup)
- Role-based access control (buyer, seller, admin)
- CRUD operations on products with image upload support
- Frontend product dashboard with cart support and weather/location greeting
- Organized monorepo structure for easy development on both backend and frontend



## Tech Stack

**Backend:**  
- Node.js, Express  
- TypeScript  
- MongoDB, Mongoose  
- Multer (file uploads)  
- JSON Web Tokens (authentication)  

**Frontend:**  
- React  
- React Router DOM  
- Tailwind CSS  
- Axios (API calls)

---

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # Express routes (e.g. products.ts, auth.ts)
│   │   ├── models/            # Mongoose models (e.g. products.ts, users.ts)
│   │   └── ...
│   ├── uploads/               # (Automatically created) File uploads storage
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components (e.g. Dashboard, EditProduct, etc.)
│   │   ├── App.tsx            # Main App component with router
│   │   ├── index.css          # Tailwind and global styles
│   │   └── index.tsx          # React app entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## Prerequisites

- Node.js (version 14 or higher)
- npm (or yarn)
- MongoDB instance (local or online)
- Git

---

## Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecommerce-project.git
   cd ecommerce-project
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` folder with the necessary environment variables, for example:

   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your_jwt_secret_key
   REACT_APP_WEATHER_KEY=your_openweather_api_key
   ```

3. **Frontend Setup**

   Open a new terminal and navigate to the `frontend` folder:

   ```bash
   cd frontend
   npm install
   ```

   Ensure your frontend `.env` file (if you need one in the frontend) is correctly set up with any required API keys or environment variables.



## Running Locally

### Backend

1. **Ensure the `uploads/` directory exists**

   The backend uses Multer for file uploads. Either manually create an `uploads` folder in the backend directory or add code to auto-create it (see further steps in your server’s index.ts file).

2. **Start the backend server**

   From the `backend` folder, run:

   ```bash
   npm run dev
   ```

   This will start the server using `ts-node-dev` and watch for changes.

### Frontend

From the `frontend` folder, run:

```bash
npm start
```

This will launch your React development server (usually on http://localhost:3000).

---

## Deployment

### Backend Deployment

- Build the backend if needed:

  ```bash
  npm run build
  ```

- Deploy your backend on your favorite hosting platform (Heroku, DigitalOcean, etc.). Make sure to set required environment variables and configure a persistent file storage solution if necessary (the local `uploads` folder may not persist across deployments).

### Frontend Deployment

- Build the React frontend for production:

  ```bash
  npm run build
  ```

- Deploy the contents of the build folder to your static server (Netlify, Vercel, GitHub Pages, etc.). Adjust your API endpoint URLs in your frontend code if needed to point to your deployed backend.



## GitHub Workflow

1. **Create a new repository on GitHub.**
2. **Add the remote URL to your local repo:**

   ```bash
   git remote add origin https://github.com/yourusername/ecommerce-project.git
   ```

3. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Initial commit for ecommerce project with backend and frontend"
   ```

4. **Push to GitHub:**

   ```bash
   git push -u origin main
   ```

5. **Create feature branches**, if working collaboratively or iteratively, and open pull requests on GitHub for code review before merging into main.



## Contributing

Contributions are welcome! Please fork the repository and open a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.






