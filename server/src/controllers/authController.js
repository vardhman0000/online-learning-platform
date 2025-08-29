const { registerUser, loginUser } = require('../services/authService');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerUser({ name, email, password, role });
    const token = generateToken(user._id, user.role); // Pass role to token
    res.status(201).json({
      message : "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message : "User logged in successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};