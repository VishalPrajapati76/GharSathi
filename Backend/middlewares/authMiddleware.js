const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookie?.token;

    if (!token) {
      return res.status(401).send({
        message: "No token found",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.userId = decoded.id;
    // req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).send({
      message: "Invalid or expired token",
      success: false
    });
  }
};

module.exports = { authMiddleware };