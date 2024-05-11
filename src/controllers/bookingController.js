import { ExecuteTransaction } from "../utils/helper.js";
import Booking from "../models/Booking.js";
import Train from "../models/Train.js";
import User from "../models/User.js";
import InitializeDatabase from "../../config/db.js";
import { QueryTypes } from "sequelize";

// Controller function to create a new booking within a transaction
export const createBooking = async (req, res) => {
  const db = await InitializeDatabase();
  try {
    const { email, passengerName, age, trainNumber, numberOfSeats } = req.body;

    // Validate input parameters
    if (!email || !passengerName || !age || !trainNumber || !numberOfSeats) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the specified train exists
    await db.exec("BEGIN TRANSACTION");
    const trainExists = await db.get(
      "SELECT * FROM train WHERE trainNumber = ?",
      [trainNumber]
    );
    if (!trainExists) {
      return res.status(404).json({ error: "Train not found" });
    }
    console.log({ trainExists });
    if (trainExists.seatsAvailable < numberOfSeats) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient seats available" });
    }

    // Generate seat numbers if seats are available
    const availableSeatNumbers = await generateAvailableSeatNumbers(
      trainExists.lastSeatNumber,
      numberOfSeats
    );
    if (availableSeatNumbers.length < numberOfSeats) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient seats available" });
    }

    // Create the booking
    await db.run(
      "INSERT INTO booking (email, passengerName, age, trainNumber,seatNumber, numberOfSeats,status) VALUES (?, ?, ?, ?, ?,?,?)",
      [
        email,
        passengerName,
        age,
        trainNumber,
        availableSeatNumbers.join(","),
        numberOfSeats,
        "Success",
      ]
    );
    const updatedSeatsAvailable = trainExists.seatsAvailable - numberOfSeats;

    await db.run(
      "UPDATE train SET seatsAvailable = ?,lastSeatNumber=? WHERE trainNumber = ?",
      [
        updatedSeatsAvailable,
        availableSeatNumbers[availableSeatNumbers.length - 1],
        trainNumber,
      ]
    );
    await db.exec("COMMIT");
    return res
      .status(200)
      .json({
        success: true,
        message: "Booking successful",
        seatNumbers: availableSeatNumbers,
      });
  } catch (error) {
    await db.exec("ROLLBACK");
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Function to generate available seat numbers
const generateAvailableSeatNumbers = async (lastSeatNumber, numberOfSeats) => {
  const availableSeatNumbers = [];
  for (let i = lastSeatNumber + 1; i <= numberOfSeats + lastSeatNumber; i++) {
    availableSeatNumbers.push(i);
  }
  return availableSeatNumbers;
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking by ID
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Update the booking status to 'cancelled'
    await booking.update({ status: "cancelled" });

    return res
      .status(200)
      .json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getBookingDetailsById = async (req, res) => {
  const db = await InitializeDatabase();
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const bookingDetails = await db.get(
      "SELECT * FROM booking WHERE bookingId = ?",
      [bookingId]
    );

    if (!bookingDetails) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Return booking details
    return res.status(200).json({ success: true, data: bookingDetails });
  } catch (error) {
    console.error("Error retrieving booking details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllBookingDetails = async (req, res) => {
  const db = await InitializeDatabase();
  try {
    const allBookings = await db.all("SELECT * FROM booking");

    if (!allBookings || allBookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    return res.status(200).json({ success: true, data: allBookings });
  } catch (error) {
    console.error("Error retrieving all booking details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};