// src/routes/cart.ts
import express, { Request, Response } from 'express';
import Cart from '../models/cart';

const router = express.Router();

// Get the cart for a specific user.
// If the cart doesn't exist, create an empty one.
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId });
    
    // Instead of returning 404 when cart not found, create a new empty cart.
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Internal Server Error', details: String(err) });
  }
});

// Add an item to the cart
router.post('/:userId/add', async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, name, price, quantity } = req.body;
    const userId = req.params.userId;

    // Find the cart for the user; if not found, create a new one.
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (existingIndex !== -1) {
      // Increase the quantity if the product is already in the cart
      cart.items[existingIndex].quantity += quantity;
    } else {
      // Otherwise, push a new item
      cart.items.push({ product, name, price, quantity });
    }

    await cart.save();
    res.json({ message: 'Item added to cart successfully', cart });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: 'Internal Server Error', details: String(err) });
  }
});

// Update an item’s quantity in the cart
router.put('/:userId/update/:itemId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { userId, itemId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found.' });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );
    if (itemIndex === -1) {
      res.status(404).json({ message: 'Cart item not found.' });
      return;
    }

    // Update the quantity of the found item
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json({ message: 'Cart item updated successfully', cart });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Internal Server Error', details: String(err) });
  }
});

// Remove an item from the cart
router.delete('/:userId/remove/:itemId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, itemId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found.' });
      return;
    }

    // Remove the item from the cart by filtering it out
    cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
    await cart.save();
    res.json({ message: 'Cart item removed successfully', cart });
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Internal Server Error', details: String(err) });
  }
});

export default router;