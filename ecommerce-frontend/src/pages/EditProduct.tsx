// src/pages/EditProduct.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl?: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Local state for product data, file selection, and loading/error management
  const [product, setProduct] = useState<Product | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch the product details on component mount.
  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch product');
        setLoading(false);
      });
  }, [id]);

  // Handle text input changes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (product) {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  // Handle file selection from local machine.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission using FormData for file upload.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Create a FormData object and append fields.
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('subCategory', product.subCategory || '');

    // If a file is selected, append it using the key "image".
    if (file) {
      formData.append('image', file);
    }

    // Send the FormData via a PUT request.
    API.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        alert('Product updated successfully!');
        navigate('/dashboard'); // Adjust navigation as needed.
      })
      .catch(() => { 
        setError('Failed to update product');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <label className="block mb-2">
        Name:
        <input
          name="name"
          value={product?.name || ''}
          onChange={handleChange}
          className="border p-1 w-full"
        />
      </label>
      <label className="block mb-2">
        Price:
        <input
          type="number"
          name="price"
          value={product?.price || ''}
          onChange={handleChange}
          className="border p-1 w-full"
        />
      </label>
      <label className="block mb-2">
        Category:
        <input
          name="category"
          value={product?.category || ''}
          onChange={handleChange}
          className="border p-1 w-full"
        />
      </label>
      <label className="block mb-2">
        Sub Category:
        <input
          name="subCategory"
          value={product?.subCategory || ''}
          onChange={handleChange}
          className="border p-1 w-full"
        />
      </label>
      {/* Replace the Image URL text input with a file input */}
      <label className="block mb-2">
        Upload Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-1 w-full"
        />
      </label>
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Update Product
      </button>
    </form>
  );
};

export default EditProduct;