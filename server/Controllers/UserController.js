import mongoose from "mongoose";
import User from "../models/UsersModel.js";

// Add an index on 'userName' for faster lookup
User.schema.index({ userName: 1 });

// To validate existing or new user
export const validateUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName }).lean(); // lean() for better performance
    if (user) {
      // Direct password comparison (no hashing)
      if (user.password === password) {
        res.json({ message: 'existing user', _id: user._id });
      } else {
        res.json({ message: 'invalid password' });
      }
    } else {
      const newUser = new User({ userName, password, databases: [] });
      await newUser.save();
      res.json({ message: 'new user created', _id: newUser._id });
    }
  } catch (err) {
    res.status(500).json({ message: "Error validating user" });
  }
};

// To create a new user
export const createUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // to Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ userName, password });
    await user.save();
    res.json(`${userName} user is saved!`);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// To get all users (with pagination to optimize large data)
export const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; 
  try {
    const users = await User.find().skip((page - 1) * limit).limit(limit).lean();
    const userNames = users.map(user => user.userName);
    res.json(userNames);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// UserName change
export const changeUserName = async (req, res) => {
  const { _id, newUserName } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { userName: newUserName },
      { new: true, upsert: false } // upsert: false ensures that a new document is not created if not found
    ).lean();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error changing username" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { _id } = req.body;
  try {
    const deletedUser = await User.findByIdAndDelete(_id).lean();
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
