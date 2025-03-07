const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers("Authorization");
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

const adminMiddleware = (req, res, next) => {
  if (req.user.role_id !== 1) {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

const businessMiddleware = (req, res, next) => {
  if (req.user.role_id !== 2) {
    return res.status(403).json({ message: "Access Denied. Businesses only." });
  }
  next();
};