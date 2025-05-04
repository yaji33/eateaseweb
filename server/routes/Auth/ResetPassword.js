const express = require("express");
const router = express.Router();
const User = require("../../models/Business/User");
const Token = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utility/sendEmail");
const { validateEmail } = require("../../utility/validation");

// Inside your request-reset route handler
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

    await Token.findOneAndDelete({ userId: user._id, type: "password-reset" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    // Save token to database with expiration (1 hour)
    await new Token({
      userId: user._id,
      token: hash,
      type: "password-reset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    }).save();

    // Fix for undefined FRONTEND_URL - use fallback if not set
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${user._id}/${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text:
        `Hello,\n\n` +
        `You requested a password reset for your EPortal account.\n\n` +
        `Please click the following link to reset your password: ${resetUrl}\n\n` +
        `This link will expire in 1 hour.\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
        `Best regards,\nThe EPortal Team`,
      html:
        `<p>Hello,</p>` +
        `<p>You requested a password reset for your EPortal account.</p>` +
        `<p>Please click the following link to reset your password:</p>` +
        `<p><a href="${resetUrl}" target="_blank">Reset your password</a></p>` +
        `<p>This link will expire in 1 hour.</p>` +
        `<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>` +
        `<p>Best regards,<br>The EPortal Team</p>`,
    });

    // Return success message
    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

// Verify Reset Token
router.get("/verify-reset-token/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired reset link" });
    }

    // Find token in database
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

    // Verify token
    const isValid = await bcrypt.compare(token, resetToken.token);
    if (!isValid) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired reset link" });
    }

    // Token is valid
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(500)
      .json({ valid: false, error: "Server error, please try again later" });
  }
});

// Reset Password
router.post("/reset-password/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Find token in database
    const resetToken = await Token.findOne({
      userId: user._id,
      type: "password-reset",
      expiresAt: { $gt: Date.now() },
    });

    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Verify token
    const isValid = await bcrypt.compare(token, resetToken.token);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete the used token
    await Token.findByIdAndDelete(resetToken._id);

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      text:
        `Hello,\n\n` +
        `Your password has been successfully reset.\n\n` +
        `If you did not reset your password, please contact our support team immediately.\n\n` +
        `Best regards,\nThe EPortal Team`,
      html:
        `<p>Hello,</p>` +
        `<p>Your password has been successfully reset.</p>` +
        `<p>If you did not reset your password, please contact our support team immediately.</p>` +
        `<p>Best regards,<br>The EPortal Team</p>`,
    });

    // Return success message
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;
