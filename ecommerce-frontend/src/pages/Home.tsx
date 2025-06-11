import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto text-center py-16">
      <h1 className="text-4xl font-semibold mb-4">Welcome to SokoNear</h1>
      <p className="text-lg text-gray-700 mb-8">
        Discover local deals and products right at your fingertips!
      </p>
      <div>
        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4">
            Login
          </button>
        </Link>
      </div>
      <p className="text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 underline">
          Create one here
        </Link>.
      </p>
    </div>
  );
};

export default Home;