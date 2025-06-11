// src/pages/ProductUploadForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ProductUploadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('price', price);
    data.append('category', category);
    data.append('subCategory', subCategory);
    if (file) {
      // The key 'image' must match the key in multer's upload.single('image')
      data.append('image', file);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      alert('Product added successfully!');
      // Clear form fields if desired
    } catch (error) {
      console.error('Error uploading product:', error);
      setError('Error uploading product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-2xl mb-4">Add New Product</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Sub Category"
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button 
        type="submit" 
        className="mt-4 p-2 bg-blue-500 text-white rounded w-full">
        Add Product
      </button>
    </form>
  );
};

export default ProductUploadForm;