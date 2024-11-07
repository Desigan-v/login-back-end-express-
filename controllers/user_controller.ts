import { Request, Response } from 'express';
import User from '../models/user_model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create a new user (signup)
export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, password, email }: { username: string; password: string; email: string } = req.body;
  console.log('Request body:', req.body);

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = await User.create({ username, password: hashedPassword, email });
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password }: { username: string; password: string } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return res.json({ message: 'Login successful', token, username: user.username, email: user.email });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update user information
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = req.params.id;
  const { username, email, password }: { username: string; email: string; password?: string } = req.body;
  
  const updatedData: any = { username, email };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  try {
    const [updated] = await User.update(updatedData, { where: { id: userId } });
    if (updated) {
      const updatedUser = await User.findByPk(userId);
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = req.params.id;

  try {
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted) {
      return res.status(204).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { username, newPassword }: { username: string; newPassword: string } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get profile of the logged-in user
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = req.user.id; // user ID from the token

  try {
    const user = await User.findByPk(userId, { attributes: ['username', 'email'] });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
