// src/models/products.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl?: string;
  seller: mongoose.Types.ObjectId; // Reference to the user who created the product
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  imageUrl: { type: String },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;