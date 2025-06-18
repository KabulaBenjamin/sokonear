# SokoNear  
A full-stack e-commerce platform bringing the market to your doorstep. This repository contains two folders:  
- **ecommerce-backend** – Express.js API with MongoDB  
- **ecommerce-frontend** – React/Vite client app  

---

## Prerequisites  
Before you begin, make sure you have the following installed on your local machine:  
- Node.js ≥ 14 & npm (or yarn)  
- MongoDB (local or Atlas)  
- Git  

---

## 1. Clone or Download the Repository  
```bash
git clone https://github.com/KabulaBenjamin/sokonear.git
cd sokonear
```
Or click **Code → Download ZIP** on the GitHub page and extract it.

---

## 2. Setup the Backend  

1. Open a terminal and navigate into the backend folder:  
   ```bash
   cd ecommerce-backend
   ```

2. Install dependencies:  
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in `ecommerce-backend/` with the following variables:  
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   OPENAI_KEY=<your-openai-api-key>      # for AI assistant
   ```

4. Start the backend server:  
   ```bash
   npm start
   # or
   yarn start
   ```
   The API will listen on `http://localhost:5000` by default.

---

## 3. Setup the Frontend  

1. In a new terminal window, navigate into the frontend folder:  
   ```bash
   cd ecommerce-frontend
   ```

2. Install dependencies:  
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in `ecommerce-frontend/` with the following variables:  
   ```env
   VITE_WEATHER_KEY=<your-openweathermap-api-key>
   VITE_API_URL=http://localhost:5000   # points to your local backend
   ```

4. Start the development server:  
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Your app will open at `http://localhost:3000` (or the port Vite reports).

---

## 4. Verify Everything Works  

1. Open your browser to the frontend URL (e.g. `http://localhost:3000`).  
2. You should see the Dashboard, complete with:  
   - Location-based greeting  
   - Weather widget  
   - Product listings and cart functionality  
   - Chatbot interface  
3. Use the backend API directly at `http://localhost:5000/api/...` to test routes (via Postman or curl) if needed.

---

## 5. Troubleshooting  

- **MongoDB connection errors**  
  - Ensure your `MONGO_URI` is correct and MongoDB is running.  
- **Port conflicts**  
  - If port 3000 or 5000 is in use, adjust the scripts in `package.json` or set `PORT` in your `.env`.

---

## 6. Contributing  
1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "feat: my new feature"`)  
4. Push to your branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

---

## 7. License & Contact  
This project is open-source under the MIT License.  
Built with ❤️ by Koikoi — [GitHub Profile](https://github.com/KabulaBenjamin)  

Enjoy building marketplaces with SokoNear!
