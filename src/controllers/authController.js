import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import InitializeDatabase from "../../config/db.js";

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    // Extract user credentials from request body
    const { email, password } = req.body;
    const db = await InitializeDatabase();
    const user = await await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      token,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Function to create a new user
export const registerUser = async (req, res) => {
  const { username, email, password, gender, role = "user" } = req.body;

  // Check if any required field is missing
  if (!username || !email || !password || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const db = await InitializeDatabase();
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db.run(
      "INSERT INTO users (username, email, password, gender, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, gender, role]
    );
    console.log("User registered:", username);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
