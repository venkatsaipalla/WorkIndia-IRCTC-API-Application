import express from "express";
import bodyParser from "body-parser";
import InitializeDatabase from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import trainRoutes from "./src/routes/trainRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize database
InitializeDatabase()
  .then((db) => {
    console.log("Database initialized");
    app.locals.db = db;
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/train", trainRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/booking", bookingRoutes);

    // Define a default route
    app.get("/", (req, res) => {
      res.send("Welcome to the Railway Management System API");
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing database:", error.message);
  });
