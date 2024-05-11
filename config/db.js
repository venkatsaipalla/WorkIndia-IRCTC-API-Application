import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import User from "../src/models/User.js";
import Train from "../src/models/Train.js";
import Booking from "../src/models/Booking.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
let dbInstance = null;

export const InitializeDatabase = async () => {
  if (!dbInstance) {
    try {
      const db = await open({
        filename: path.join(__dirname, "./sqlite.db"),
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      });
      // Create assignments table if it doesn't exist

      await db.exec(`CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user'))
      );`);
      console.log("-----------------------------------------");
      console.log("User Database initialized");

      await db.exec(`CREATE TABLE IF NOT EXISTS train (
        trainId INTEGER PRIMARY KEY AUTOINCREMENT,
        trainNumber VARCHAR(255) NOT NULL,
        trainName VARCHAR(255) NOT NULL,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        lastSeatNumber INTEGER DEFAULT 1,
        seatsAvailable INTEGER NOT NULL
      );`);
      console.log("Train Database initialized");

      await db.exec(`CREATE TABLE IF NOT EXISTS booking (
        bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) NOT NULL,
        passengerName VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        trainNumber INTEGER NOT NULL,
        seatNumber VARCHAR(255) NOT NULL,
        numberOfSeats INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'failure',
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
        FOREIGN KEY (trainNumber) REFERENCES train(trainId) ON DELETE CASCADE
    );`);
      console.log("Booking Database initialized");
      return db;
    } catch (error) {
      console.error("Error initializing database:", error.message);
      throw error;
    }
  }
  return dbInstance;
};

export default InitializeDatabase;
