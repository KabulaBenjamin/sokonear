// src/routes/products.ts
import express, { Request, Response } from 'express';
import Product from '../models/products';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be stored in the "uploads" folder
  },
  filename: function (req, file, cb) {
    // Create a unique filename using a timestamp and file original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Optional: Configure file filter to restrict file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only JPEG, PNG, or GIF files
  if (file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/png' || 
      file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Add a new product with image upload
router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, category, subCategory } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({
        message: 'Name, price, and category are required.'
      });
      return;
    }

    // Retrieve file path if file was uploaded; otherwise, leave undefined
    const imageUrl = req.file ? req.file.path : undefined;

    const newProduct = new Product({ name, price, category, subCategory, imageUrl });
    await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully!',
      product: newProduct
    });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: String(err)
    });
  }
});

// Edit an existing product with file upload support
router.put('/:id', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    // Create update data from req.body
    const updateData: any = { ...req.body };

    // If a file was uploaded, add/update the imageUrl field
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    res.json({
      message: 'Product updated successfully!',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: String(err)
    });
  }
});

// Delete a product
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: String(err)
    });
  }
});

// Get all products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: String(err)
    });
  }
});

// Get a single product by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: String(err)
    });
  }
});

export default router;