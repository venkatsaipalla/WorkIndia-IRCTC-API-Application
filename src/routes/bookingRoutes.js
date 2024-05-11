// app/routes/bookingRoutes.js

import express from "express";
import {
  createBooking,
  getBookingDetailsById,
  getAllBookingDetails,
  cancelBooking,
} from "../controllers/bookingController.js";
import {
  authenticateToken,
  validateApiKeyAndRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

//get all booking details
router.get("/all", authenticateToken, getAllBookingDetails);

// Route to create a new booking
router.post("/book", authenticateToken, createBooking);

// Route to get booking details by ID
router.get("/:bookingId", authenticateToken, getBookingDetailsById);

// Route to cancel a booking by ID
router.delete("/:id", authenticateToken, cancelBooking);



export default router;
