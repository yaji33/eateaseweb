const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role_id !== 1) {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

const businessMiddleware = (req, res, next) => {
  if (req.user.role_id !== 3) {
    return res.status(403).json({ message: "Access Denied. Businesses only." });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  businessMiddleware,
};
