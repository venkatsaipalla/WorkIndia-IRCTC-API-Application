// import db from '../../config/db';
import { ExecuteTransaction } from "../utils/helper.js";
import User from "../models/User.js";

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
  try {
    const { email } = req.params;
    const { name, age, role } = req.body;

    const result = await ExecuteTransaction(async (transaction) => {
      const existingUser = await User.findOne({
        where: { email },
        transaction,
      });

      if (!existingUser) {
        throw new Error("User not found");
      }

      const updatedUserData = {
        name: name || existingUser.name, // Use existing name if not provided
        age: age || existingUser.age, // Use existing age if not provided
        role: role || existingUser.role, // Use existing role if not provided
      };

      // Update the user with the merged data
      const [updatedRows] = await User.update(updatedUserData, {
        where: { email },
        transaction,
      });

      return { updatedRows };
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        updatedRows: result.updatedRows,
      });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
          throw new Error('User not found');
        }
  
        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }
  
        // Delete the user
        const deletedRows = await User.destroy({ where: { email }, transaction });
  
        return { deletedRows };
      });
  
      return res.status(200).json({ success: true, message: 'User deleted successfully', deletedRows: result.deletedRows });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
export const getUserList = async (req, res) => {
  try {
    const result = await ExecuteTransaction(async (transaction) => {
      // Retrieve all users within the transaction
      const users = await User.findAll({ transaction });
      return { users };
    });

    return res.status(200).json({ success: true, users: result.users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
