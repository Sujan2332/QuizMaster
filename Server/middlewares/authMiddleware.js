const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Import the User model to fetch user details from DB

// Middleware to verify token and protect routes
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Not Authorized, No Token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database using the ID in the decoded payload
    const user = await User.findById(decoded.id).select("-password"); // Exclude password from fetched user

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to the request object for further processing
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not Authorized, Token Failed", error });
  }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin Access Only" });
  }
};

module.exports = { protect, admin };
