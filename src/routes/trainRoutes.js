import express from "express";
import {
  createTrain,
  getTrainByNumber,
  updateTrainDetails,
  deleteTrain,
} from "../controllers/trainController.js";
import {
  authenticateToken,
  validateApiKeyAndRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new train
router.post("/add", authenticateToken, validateApiKeyAndRole, createTrain);

// Route to get train details by train number
router.get("/:trainNumber", authenticateToken, getTrainByNumber);

// Route to update train details by train number
router.put(
  "/:trainNumber",
  authenticateToken,
  validateApiKeyAndRole,
  updateTrainDetails
);

// Route to delete a train by train number
router.delete(
  "/:trainNumber",
  authenticateToken,
  validateApiKeyAndRole,
  deleteTrain
);

export default router;
