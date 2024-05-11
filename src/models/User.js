import { DataTypes } from "sequelize";
import InitializeDatabase from "../../config/db.js";

const User = async () => {
  const db = await InitializeDatabase();
  
  const UserModel = db.define("User", {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
  });

  return UserModel;
};




export default User;



export const registerUser = async (req, res) => {
  const { username, email, password, gender, role = "user" } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const db = await InitializeDatabase();
    await db.run("INSERT INTO users (username, email, password, gender, role) VALUES (?, ?, ?, ?, ?)", [
      username,
      email,
      hashedPassword,
      gender,
      role
    ]);
    console.log("User registered:", email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
