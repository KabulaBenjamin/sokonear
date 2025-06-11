import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; // Ensure you have created an Axios instance

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // New state for role
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // The API call now includes the role field along with the rest of the data.
      const response = await API.post('/auth/register', { name, email, password, role });
      
      // Using the response variable: logging the full response and showing a message to the user.
      console.log('Registration success:', response.data);
      
      // Optionally, if the response contains a message, it can be used here.
      alert(response.data.message || 'Account created successfully! Please log in.');
      
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto text-center py-16">
      <h1 className="text-4xl font-semibold mb-4">Create Account</h1>
      <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {/* Role dropdown field */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="power">Power</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Account
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 underline">
          Log in here
        </Link>.
      </p>
    </div>
  );
};

export default Register;