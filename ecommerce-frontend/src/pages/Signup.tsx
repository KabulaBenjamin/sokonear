// src/pages/Signup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  // Form state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Replace the endpoint URL with your actual signup endpoint
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role,
      });

      console.log('Signup successful:', res.data);

      // Store the received user data in localStorage (for auth persistence)
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Immediately sign in the user by navigating to the dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'buyer' | 'seller' | 'admin')}
            className="border p-2 w-full"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;