const User = require('../models/User');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, role: role || 'Student' });
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  return user;
};

module.exports = { registerUser, loginUser };