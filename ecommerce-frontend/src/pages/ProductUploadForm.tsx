// src/pages/ProductUploadForm.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductUploadForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission using async/await and FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify user is logged in
    if (!user) {
      setError('You must be logged in to add a product.');
      return;
    }

    // Prepare the payload as a FormData instance
    const data = new FormData();
    data.append('name', name);
    data.append('price', price);
    data.append('category', category);
    data.append('subCategory', subCategory);
    if (file) {
      data.append('image', file);
    }
    // Append the seller id from AuthContext
    data.append('seller', user.id);

    try {
      const response = await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response from product upload:', response.data);
      alert('Product added successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error uploading product:', err);
      setError(err.response?.data?.message || 'Error uploading product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-2xl mb-4">Add New Product</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <label htmlFor="productName" className="block text-sm font-medium mb-1">
        Product Name
      </label>
      <input
        id="productName"
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />

      <label htmlFor="price" className="block text-sm font-medium mb-1">
        Price
      </label>
      <input
        id="price"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />

      <label htmlFor="category" className="block text-sm font-medium mb-1">
        Category
      </label>
      <input
        id="category"
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />

      <label htmlFor="subCategory" className="block text-sm font-medium mb-1">
        Sub Category (optional)
      </label>
      <input
        id="subCategory"
        type="text"
        placeholder="Sub Category"
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <label htmlFor="productImage" className="block text-sm font-medium mb-1">
        Product Image
      </label>
      <input
        id="productImage"
        type="file"
        onChange={handleFileChange}
        className="mb-2"
      />

      <button
        type="submit"
        className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductUploadForm;