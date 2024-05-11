import InitializeDatabase from "../../config/db.js";
import { ExecuteTransaction } from "../utils/helper.js";
import Train from '../models/Train.js'

const createTrain = async (req, res) => {
  try {
    // Extract train details from the request body
    const { trainNumber, trainName, source, destination, seatsAvailable } = req.body;

    // Validate required fields
    if (!trainNumber || !trainName || !source || !destination || !seatsAvailable) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the train already exists
    const db = await InitializeDatabase();
    const existingTrain = await db.get("SELECT * FROM train WHERE trainNumber = ?", [trainNumber]);
    if (existingTrain) {
      return res.status(400).json({ error: "Train with this number already exists" });
    }

    // Insert new train into the database
    await db.run("INSERT INTO train (trainNumber, trainName, source, destination, seatsAvailable) VALUES (?, ?, ?, ?, ?)", [
      trainNumber,
      trainName,
      source,
      destination,
      seatsAvailable
    ]);

    res.status(201).json({ message: "Train created successfully" });
  } catch (error) {
    console.error("Error creating train:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to read a train by trainNumber
export const getTrainByNumber = async (req, res) => {
    try {
      const { trainNumber } = req.params;
  
      const result = await ExecuteTransaction(async (transaction) => {
        // Retrieve the train by its number within the transaction
        const train = await Train.findOne({ where: { trainNumber }, transaction });
  
        if (!train) {
          throw new Error('Train not found');
        }
  
        return { train };
      });
  
      return res.status(200).json({ success: true, train: result.train });
    } catch (error) {
      console.error('Error fetching train by number:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
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
      const { source, destination, totalSeats } = req.body;
  
      const result = await ExecuteTransaction(async (transaction) => {
        // Fetch the existing train details
        const existingTrain = await Train.findOne({ where: { trainNumber }, transaction });
  
        if (!existingTrain) {
          throw new Error('Train not found');
        }
  
        // Update the train details with provided parameters
        const updatedTrainDetails = {
          source: source !== undefined ? source : existingTrain.source,
          destination: destination !== undefined ? destination : existingTrain.destination,
          totalSeats: totalSeats !== undefined ? totalSeats : existingTrain.totalSeats
        };
  
        // Update the train details in the database
        const [updatedRows] = await Train.update(updatedTrainDetails, { where: { trainNumber }, transaction });
  
        return { updatedRows };
      });
  
      return res.status(200).json({ success: true, message: 'Train details updated successfully', updatedRows: result.updatedRows });
    } catch (error) {
      console.error('Error updating train details:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
// Function to delete a train by trainNumber
export const deleteTrain = async (req, res) => {
    try {
      const { trainNumber } = req.params;
  
      const result = await ExecuteTransaction(async (transaction) => {
        // Find the train to be deleted
        const trainToDelete = await Train.findOne({ where: { trainNumber }, transaction });
  
        if (!trainToDelete) {
          throw new Error('Train not found');
        }
  
        // Delete the train
        await Train.destroy({ where: { trainNumber }, transaction });
  
        return { trainNumber };
      });
  
      return res.status(200).json({ success: true, message: 'Train deleted successfully', deletedTrainNumber: result.trainNumber });
    } catch (error) {
      console.error('Error deleting train:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
