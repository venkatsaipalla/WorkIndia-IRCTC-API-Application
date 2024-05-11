import express from 'express';
import { updateUser, deleteUser, getUserList } from '../controllers/userController.js';
import { authenticateToken,validateApiKeyAndRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.use(authenticateToken);

// Route to get the list of users
router.get('/all',authenticateToken, validateApiKeyAndRole,getUserList);

// Route to update user details by ID
router.put('/:email',authenticateToken, updateUser);

// Route to delete a user by ID
router.delete('/:email', authenticateToken,deleteUser);

export default router;