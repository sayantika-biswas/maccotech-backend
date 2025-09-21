const express = require('express');
const sendOTPEmail = require('../../utils/email')
const User = require('../../models/User/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();

// Store OTPs temporarily (in production use Redis)
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email, otp, expiresAt } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Save OTP to temporary store
    otpStore.set(email, {
      otp,
      expiresAt: new Date(expiresAt)
    });

    // Send email
    const emailSent = await sendOTPEmail(email, otp);

    if (emailSent) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // ✅ 1. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // ✅ 3. Update the user's password with the hashed version
    user.password = hashedPassword;
    await user.save();

    // ✅ 4. Clear OTP (if applicable)
    otpStore.delete(email);

    return res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


module.exports = router;