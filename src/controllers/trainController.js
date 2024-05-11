import InitializeDatabase from "../../config/db.js";
import { ExecuteTransaction } from "../utils/helper.js";
import Train from "../models/Train.js";

export const createTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, source, destination, seatsAvailable } =
      req.body;

    if (
      !trainNumber ||
      !trainName ||
      !source ||
      !destination ||
      !seatsAvailable
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the train already exists
    const db = await InitializeDatabase();
    const existingTrain = await db.get(
      "SELECT * FROM train WHERE trainNumber = ?",
      [trainNumber]
    );
    if (existingTrain) {
      return res
        .status(400)
        .json({ error: "Train with this number already exists" });
    }

    // Insert new train into the database
    await db.run(
      "INSERT INTO train (trainNumber, trainName, source, destination, seatsAvailable) VALUES (?, ?, ?, ?, ?)",
      [trainNumber, trainName, source, destination, seatsAvailable]
    );

    res.status(201).json({ message: "Train created successfully" });
  } catch (error) {
    console.error("Error creating train:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to read a train by trainNumber
export const getTrainByNumber = async (req, res) => {
  try {
    // Extract trainNumber from request parameters
    const { trainNumber } = req.params;

    // Validate trainNumber
    if (!trainNumber) {
      return res.status(400).json({ error: "Train number is required" });
    }

    // Retrieve train details from the database
    const db = await InitializeDatabase();
    const train = await db.get("SELECT * FROM train WHERE trainNumber = ?", [
      trainNumber,
    ]);

    // Check if train exists
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    // Return train details
    res.status(200).json(train);
  } catch (error) {
    console.error("Error fetching train:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTrains = async (req, res) => {
  try {
    const selectQuery = "SELECT * FROM train";

    const db = await InitializeDatabase();
    const trains = await db.all(selectQuery);

    // Return the fetched trains as a response
    res.status(200).json(trains);
  } catch (error) {
    console.error("Error fetching trains:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update Train Details
export const updateTrainSeats = async (trainNumber, seatsAvailable) => {
  return await ExecuteTransaction(async (connection) => {
    await connection.execute(
      "UPDATE trains SET seatsAvailable = ? WHERE trainNumber = ?",
      [seatsAvailable, trainNumber]
    );
    return { success: true, message: "Train seats updated successfully" };
  });
};

// Function to update train details (name, source, destination, seatsAvailable)

export const updateTrainDetails = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const { trainName, source, destination, lastSeatNumber, seatsAvailable } =
      req.body;

    if (!trainNumber) {
      return res.status(400).json({ error: "Train number is required" });
    }

    let updateQuery = "UPDATE train SET";
    const queryParams = [];

    if (trainName) {
      updateQuery += " trainName = ?,";
      queryParams.push(trainName);
    }
    if (source) {
      updateQuery += " source = ?,";
      queryParams.push(source);
    }
    if (destination) {
      updateQuery += " destination = ?,";
      queryParams.push(destination);
    }
    if (lastSeatNumber !== undefined) {
      updateQuery += " lastSeatNumber = ?,";
      queryParams.push(lastSeatNumber);
    }
    if (seatsAvailable !== undefined) {
      updateQuery += " seatsAvailable = ?,";
      queryParams.push(seatsAvailable);
    }

    // Remove trailing comma and add WHERE condition
    updateQuery = updateQuery.slice(0, -1) + " WHERE trainNumber = ?";
    queryParams.push(trainNumber);

    // Execute the UPDATE query with the provided parameters
    const db = await InitializeDatabase();
    const result = await db.run(updateQuery, queryParams);

    // Check if any row was affected
    if (result.changes === 0) {
      return res.status(404).json({ error: "Train not found" });
    }

    // Return success response
    res.status(200).json({ message: "Train details updated successfully" });
  } catch (error) {
    console.error("Error updating train details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a train by trainNumber
export const deleteTrain = async (req, res) => {
  try {
    const { trainNumber } = req.params;

    if (!trainNumber) {
      return res.status(400).json({ error: "Train number is required" });
    }

    const deleteQuery = "DELETE FROM train WHERE trainNumber = ?";

    const db = await InitializeDatabase();
    const result = await db.run(deleteQuery, trainNumber);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Train not found" });
    }

    res.status(200).json({ message: "Train deleted successfully" });
  } catch (error) {
    console.error("Error deleting train:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
