const express = require("express");
const { authMiddleware, businessMiddleware } = require("../../middleware/authMiddleware")

const router = express.Router();

router.get("/dashboard", authMiddleware, businessMiddleware, (req, res) => {
    res.json({ message: "Welcome Business!", User: req.user });
});

module.exports = router;