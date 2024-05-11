import { ExecuteTransaction } from "../utils/helper.js";
import Booking from "../models/Booking.js";
import Train from "../models/Train.js";
import User from "../models/User.js";

// Controller function to create a new booking within a transaction
export const createBooking = async (req, res) => {
  try {
    const { email, passengerName, age, trainNumber, numberOfSeats } = req.body;

    // Check if the train has sufficient seats available
    const train = await Train.findOne({ where: { trainNumber } });
    if (!train) {
      return res
        .status(404)
        .json({ success: false, message: "Train not found" });
    }
    if (train.seatsAvailable < numberOfSeats) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient seats available" });
    }

    // Generate seat numbers if seats are available
    const availableSeatNumbers = await generateAvailableSeatNumbers(
      train.lastSeatNumber,
      numberOfSeats
    );
    if (availableSeatNumbers.length < numberOfSeats) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient seats available" });
    }

    const result = await ExecuteTransaction(async (transaction) => {
      // Create the booking within the transaction
      const newBooking = await Booking.create(
        {
          email,
          passengerName,
          age,
          trainNumber,
          numberOfSeats,
          seatNumber: availableSeatNumbers.toString(),
          status: "Success",
        },
        { transaction }
      );
      // Update the lastSeatNumber for the train
      await train.update(
        {
          lastSeatNumber: availableSeatNumbers[availableSeatNumbers.length - 1],
        },
        { transaction }
      );

      // Update seatsAvailable in the train
      const seatsAvailable = train.seatsAvailable - numberOfSeats;
      await train.update({ seatsAvailable }, { transaction });
      return { newBooking, seatNumbers: availableSeatNumbers };
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: result.newBooking,
      seatNumbers: result.seatNumbers,
    });
  } catch (error) {
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

export const getBookingDetails = () => {};
