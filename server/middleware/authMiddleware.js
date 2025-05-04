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

    console.log(
      `🔐 Authenticated user: ID=${verified.id}, Role=${verified.role_id}`
    );

    next();
  } catch (error) {
    console.error("🚫 Auth error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log(`👑 Admin check: User role=${req.user.role_id}, Required role=1`);

  if (req.user.role_id !== 1) {
    console.log(
      `❌ Access denied: User with role ${req.user.role_id} attempted to access admin route`
    );
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }

  console.log(`✅ Admin access granted for user ID=${req.user.id}`);
  next();
};

const businessMiddleware = (req, res, next) => {
  console.log(
    `🏢 Business check: User role=${req.user.role_id}, Required role=3`
  );

  if (req.user.role_id !== 3) {
    console.log(
      `❌ Access denied: User with role ${req.user.role_id} attempted to access business route`
    );
    return res.status(403).json({ message: "Access Denied. Businesses only." });
  }

  console.log(`✅ Business access granted for user ID=${req.user.id}`);
  next();
};

// New combined role middleware for routes that can be accessed by multiple roles
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(
      `🔒 Role check: User role=${
        req.user.role_id
      }, Allowed roles=[${allowedRoles.join(", ")}]`
    );

    if (!allowedRoles.includes(req.user.role_id)) {
      console.log(
        `❌ Access denied: User with role ${req.user.role_id} not in allowed roles`
      );
      return res
        .status(403)
        .json({ message: "Access Denied. Insufficient permissions." });
    }

    console.log(`✅ Role-based access granted for user ID=${req.user.id}`);
    next();
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  businessMiddleware,
  roleMiddleware,
};
