// src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const router = Router();

/* ---------------------- Signup Endpoint ---------------------- */
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    res.status(400).json({ message: 'Please provide name, email, password, and role.' });
    return;
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // If a user already exists, update their role.
      user.role = role;
      await user.save();

      res.status(200).json({
        message: 'Existing user role updated successfully.',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
      return;
    } else {
      // Create and save a new user (password will be hashed via pre-save middleware)
      const newUser = new User({ name, email, password, role });
      await newUser.save();

      // Generate a token for the new user
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '1d' }
      );

      res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
      return;
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
    return;
  }
});

/* ---------------------- Login Endpoint ---------------------- */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('[DEBUG][Login] Missing email or password. Request body:', req.body);
    res.status(400).json({ message: 'Please provide email and password.' });
    return;
  }

  try {
    console.log('[DEBUG][Login] Received login request:', req.body);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('[DEBUG][Login] No user found with email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('[DEBUG][Login] Password mismatch for user with email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    console.log('[DEBUG][Login] Login successful for user with email:', email);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
    return;
  } catch (error: any) {
    console.error('[DEBUG][Login] Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
    return;
  }
});

/* ---------------------- Rate Limiter for Forgot Password ---------------------- */
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset requests from this IP, please try again after 15 minutes.'
});

/* ---------------------- Nodemailer Transporter Setup ---------------------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'your_ethereal_user@example.com',
    pass: process.env.SMTP_PASS || 'your_ethereal_password'
  }
});

/* ---------------------- Forgot Password Endpoint ---------------------- */
router.post('/forgot-password', forgotPasswordLimiter, async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Please provide your email.' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    // For security, always return success even if a user doesn't exist.
    if (!user) {
      res.status(200).json({
        message: 'If a user with that email exists, an email has been sent with reset instructions.'
      });
      return;
    }

    // Generate a reset token and hash it
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    const mailOptions = {
      from: '"No Reply" <no-reply@yourapp.com>',
      to: user.email,
      subject: 'Password Reset Request',
      text: `Hello,

You requested a password reset. Please click on the link below to reset your password:
${resetURL}

If you did not request this, please ignore this email.

Note: This link will expire in 1 hour.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'If a user with that email exists, an email has been sent with reset instructions.'
    });
    return;
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
    return;
  }
});

/* ---------------------- Reset Password Endpoint ---------------------- */
router.post('/reset-password/:token', async (req: Request, res: Response, next: NextFunction) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: 'Please provide a new password.' });
    return;
  }

  try {
    // Hash the token from the URL to compare with the stored hashed token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      return;
    }

    // Set the new password; the pre-save hook will hash it
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: 'Your password has been successfully reset. Please log in with your new password.'
    });
    return;
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
    return;
  }
});

export default router;