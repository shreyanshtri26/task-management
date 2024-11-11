const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  static async registerUser(userData) {
    const user = new User(userData);
    await user.save();
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    return { user, token, refreshToken };
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    return { user, token, refreshToken };
  }
}

module.exports = AuthService;