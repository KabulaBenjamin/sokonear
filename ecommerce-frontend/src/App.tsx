// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditProduct from './pages/EditProduct';
import ProductUploadForm from './pages/ProductUploadForm';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App: React.FC = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex space-x-4">
        {/* Navigation links */}
        <Link to="/dashboard" className="text-blue-600">
          Dashboard
        </Link>
        <Link to="/products/add" className="text-blue-600">
          Add Product
        </Link>
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
        <Link to="/signup" className="text-blue-600">
          Sign Up
        </Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/add" element={<ProductUploadForm />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Fallback route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;