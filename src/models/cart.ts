import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId; // Added _id property
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  user: string;
  items: ICartItem[];
  total: number;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema: Schema = new Schema({
  user: { type: String, required: true },
  items: [CartItemSchema],
  total: { type: Number, required: true, default: 0 },
});

// Pre-save hook to recalculate the total
CartSchema.pre<ICart>('save', function (next) {
  this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;