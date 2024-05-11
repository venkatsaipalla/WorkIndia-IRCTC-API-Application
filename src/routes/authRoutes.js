import express from "express";
import { loginUser,registerUser } from "../controllers/authController.js";
const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to authenticate a user
router.post('/login', loginUser);

export default router;