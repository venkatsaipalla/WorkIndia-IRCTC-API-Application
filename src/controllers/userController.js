// import db from '../../config/db';
import { ExecuteTransaction } from "../utils/helper.js";
import User from "../models/User.js";
import InitializeDatabase from "../../config/db.js";
// Function to create a new user
export const createUser = async (req, res) => {
  try {
    const { email, name, age, role = "user" } = req.body;
    const result = await ExecuteTransaction(async (transaction) => {
      const newUser = await User.create(
        { email, name, age, role },
        { transaction }
      );
      return { newUser };
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller function to update a user within a transaction
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, gender, role } = req.body;

  try {
    const db = await InitializeDatabase();

    // Fetch the current user details
    const currentUser = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details with provided values
    const updatedUser = {
      username: username || currentUser.username,
      email: email || currentUser.email,
      password: password || currentUser.password,
      gender: gender || currentUser.gender,
      role: role || currentUser.role,
    };

    // Update user in the database
    await db.run(
      "UPDATE users SET username = ?, email = ?, password = ?, gender = ?, role = ? WHERE id = ?",
      [
        updatedUser.username,
        updatedUser.email,
        updatedUser.password,
        updatedUser.gender,
        updatedUser.role,
        id,
      ]
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a user after authentication with password
export const deleteUser = async (req, res) => {
  try {
    const { email, password } = req.params;

    const result = await executeTransaction(async (transaction) => {
      // Fetch the user by email
      const user = await User.findOne({ where: { email }, transaction });

      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Incorrect password");
      }

      // Delete the user
      const deletedRows = await User.destroy({ where: { email }, transaction });

      return { deletedRows };
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const db = await InitializeDatabase();
    // Fetch all users from the database
    const users = await db.all("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
