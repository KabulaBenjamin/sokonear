// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="text-xl font-bold">SokoNear</div>
      <div className="flex space-x-0 sm:space-x-4 mt-2 sm:mt-0">
        <Link to="/login" className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign In
        </Link>
        <Link to="/register" className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;