const express = require("express");
const router = express.Router();
const User = require("../../models/Business/User");
const Token = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utility/sendEmail");
const { validateEmail } = require("../../utility/validation");

// Request password reset
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // Remove existing reset tokens for this user
    await Token.findOneAndDelete({ userId: user._id, type: "password-reset" });

    // Create new token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await new Token({
      userId: user._id,
      token: hash,
      type: "password-reset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    }).save();

    // Construct reset link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${user._id}/${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Hello,\n\nYou requested a password reset for your EPortal account.\n\nPlease click the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe EPortal Team`,
      html: `<p>Hello,</p><p>You requested a password reset for your EPortal account.</p><p><a href="${resetUrl}" target="_blank">Reset your password</a></p><p>This link will expire in 1 hour.</p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>The EPortal Team</p>`,
    });

    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch {
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

// Verify reset token
router.get("/verify-reset-token/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired reset link" });
    }

    const resetToken = await Token.findOne({
      userId: user._id,
      type: "password-reset",
      expiresAt: { $gt: Date.now() },
    });

    if (!resetToken) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired reset link" });
    }

    const isValid = await bcrypt.compare(token, resetToken.token);
    if (!isValid) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired reset link" });
    }

    res.status(200).json({ valid: true });
  } catch {
    res
      .status(500)
      .json({ valid: false, error: "Server error, please try again later" });
  }
});

// Reset password
router.post("/reset-password/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    const resetToken = await Token.findOne({
      userId: user._id,
      type: "password-reset",
      expiresAt: { $gt: Date.now() },
    });

    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    const isValid = await bcrypt.compare(token, resetToken.token);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Token.findByIdAndDelete(resetToken._id);

    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      text: `Hello,\n\nYour password has been successfully reset.\n\nIf you did not reset your password, please contact our support team immediately.\n\nBest regards,\nThe EPortal Team`,
      html: `<p>Hello,</p><p>Your password has been successfully reset.</p><p>If you did not reset your password, please contact our support team immediately.</p><p>Best regards,<br>The EPortal Team</p>`,
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;
