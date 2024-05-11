// app/routes/bookingRoutes.js

import express from "express";
import {
  createBooking,
  getBookingDetails,
  cancelBooking,
} from "../controllers/bookingController.js";
import {
  authenticateToken,
  validateApiKeyAndRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new booking
router.post("/book", authenticateToken, createBooking);

// Route to get booking details by ID
router.get("/:id", authenticateToken, getBookingDetails);

// Route to cancel a booking by ID
router.delete("/:id", authenticateToken, cancelBooking);

export default router;
