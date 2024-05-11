import { DataTypes } from "sequelize";
import InitializeDatabase from "../../config/db.js";

const Train = async () => {
  const db = await InitializeDatabase();

  const TrainModel = db.define("Train", {
    trainNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    trainName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastSeatNumber: {
      type: DataTypes.INTEGER,
      DefaultValue: 1,
    },
    seatsAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return TrainModel;
};

export default Train;
