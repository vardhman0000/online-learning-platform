const User = require('../models/User');
const hashPassword = require('../utils/hashPassword');

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, role: role || 'Student' });
  return user;
};

module.exports = { registerUser };