"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.resetPassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create a new user (signup)
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    console.log('Request body:', req.body);
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required.' });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_model_1.default.create({ username, password: hashedPassword, email });
        return res.status(201).json({ message: 'User created successfully', user });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.signup = signup;
// Login user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ where: { username } });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ message: 'Login successful', token, username: user.username, email: user.email });
        }
        else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});
exports.login = login;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
// Get a user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (user) {
            return res.status(200).json(user);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
// Update user information
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    const updatedData = { username, email };
    if (password) {
        updatedData.password = yield bcryptjs_1.default.hash(password, 10);
    }
    try {
        const [updated] = yield user_model_1.default.update(updatedData, { where: { id: userId } });
        if (updated) {
            const updatedUser = yield user_model_1.default.findByPk(userId);
            return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const deleted = yield user_model_1.default.destroy({ where: { id: userId } });
        if (deleted) {
            return res.status(204).json({ message: 'User deleted successfully' });
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
// Reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, newPassword } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
// Get profile of the logged-in user
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // user ID from the token
    try {
        const user = yield user_model_1.default.findByPk(userId, { attributes: ['username', 'email'] });
        if (user) {
            return res.status(200).json(user);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getProfile = getProfile;
