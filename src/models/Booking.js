import { DataTypes } from "sequelize";
import Train from "./Train.js";
import User from "./User.js";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 for generating random IDs
import InitializeDatabase from "../../config/db.js";

const Booking = async () => {
  const db = await InitializeDatabase();

  const BookingModel = db.define("Booking", {
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: () => uuidv4(), // Generate a random UUID as the default value
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trainNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "failure",
    },
  });
  // Define associations
  BookingModel.belongsTo(User, { foreignKey: "email", onDelete: "CASCADE" });
  BookingModel.belongsTo(Train, {
    foreignKey: "trainNumber",
    onDelete: "CASCADE",
  });
  return BookingModel;
};

export default Booking;
