"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user_controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
// Create the router instance
const router = (0, express_1.Router)();
// Define the routes
router.post('/signup', user_controller_1.signup); // Create a new user
router.post('/login', user_controller_1.login); // User login
router.get('/users', user_controller_1.getAllUsers); // Get all users
router.get('/users/:id', user_controller_1.getUserById); // Get a user by ID
router.put('/users/:id', user_controller_1.updateUser); // Update a user by ID
router.delete('/users/:id', user_controller_1.deleteUser); // Delete a user by ID
router.put('/resetPassword', user_controller_1.resetPassword); // Reset user password (optional)
router.get('/profile', authenticateToken_1.authenticateToken, user_controller_1.getProfile); // Get profile (authenticated route)
exports.default = router;
