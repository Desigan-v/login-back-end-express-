import { Router } from 'express';
import {
  getAllUsers,
  signup,
  login,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  getProfile
} from '../controllers/user_controller';
import { authenticateToken } from '../middleware/authenticateToken';

// Create the router instance
const router = Router();

// Define the routes
router.post('/signup', signup); // Create a new user
router.post('/login', login); // User login
router.get('/users', getAllUsers); // Get all users
router.get('/users/:id', getUserById); // Get a user by ID
router.put('/users/:id', updateUser); // Update a user by ID
router.delete('/users/:id', deleteUser); // Delete a user by ID
router.put('/resetPassword', resetPassword); // Reset user password (optional)
router.get('/profile', authenticateToken, getProfile); // Get profile (authenticated route)

export default router;
