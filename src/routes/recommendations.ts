// src/routes/recommendations.ts
import { Router } from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

/* ---------------- Seller Image Uploads ---------------- */
// Use multer to handle file uploads. For simplicity, we use memory storage.
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { files: 3 }, // Limit to 3 files
});

// Updated endpoint to explicitly wrap multer in a function to resolve TypeScript issues
router.post('/seller-images', (req, res, next) => {
  upload.array('images', 3)(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err });
    }
    res.status(200).json({ message: "Images uploaded successfully", files: req.files });
  });
});

/* ---------------- AI-generated Product Descriptions ---------------- */
router.post('/generate-description', async (req, res) => {
  const { productName, productDetails } = req.body;
  try {
    const generatedDescription = `Introducing ${productName}! This product is remarkable for ${productDetails}. It combines quality and style in one package.`;
    res.status(200).json({ generatedDescription });
  } catch (error) {
    res.status(500).json({ message: "Error generating product description", error });
  }
});

/* ---------------- Smart Pricing Recommendations ---------------- */
router.post('/pricing-recommendations', async (req, res) => {
  const { productCategory, productCost } = req.body;
  try {
    const recommendedPrice = productCost * 1.20;
    res.status(200).json({ recommendedPrice });
  } catch (error) {
    res.status(500).json({ message: "Error generating pricing recommendations", error });
  }
});

/* ---------------- Order Notifications via Email ---------------- */
router.post('/order-notifications', async (req, res) => {
  const { orderId, customerEmail, orderDetails } = req.body;
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: '"Store Notifications" <no-reply@store.com>',
      to: customerEmail,
      subject: `Your Order #${orderId} Confirmation`,
      text: `Thank you for your order!\n\nOrder Details:\n${orderDetails}\n\nWe are processing your order and will update you shortly.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Order notification sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending order notification", error });
  }
});

export default router;