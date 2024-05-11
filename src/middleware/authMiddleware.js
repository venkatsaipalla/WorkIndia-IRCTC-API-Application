import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Keys from "../../config/keys.js";
dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err.message);
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
    req.user = decoded; // Change 'user' to 'decoded'
    next();
  });
};

export const validateApiKeyAndRole = (req, res, next) => {
  // Extract the API key from the request headers
  const apiKey = req.headers["admin-api-key"];
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // Check if the API key is present
  if (!apiKey) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: API key is missing" });
  }

  // Verify the API key
  if (Keys["admin-api-key"] !== apiKey) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid API key" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.error("Error verifying token:", err.message);
          return res.status(403).json({ message: "Forbidden - Invalid token" });
        }
        console.log({ decoded });
        return decoded;
      }
    );
    const userRole = decoded.role;
    if (!userRole) throw "Pass Bearer Authentication Token";
    // Check if the user role is 'admin'
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: User is not an admin" });
    }
    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return res.status(500).json({ success: false, message: error });
  }
};
