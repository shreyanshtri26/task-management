const AuthService = require('../services/authService');
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('user', 'admin').default('user'),
});

class AuthController {
  static async register(req, res) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { user, token, refreshToken } = await AuthService.registerUser(req.body);
      res.status(201).json({ user, token, refreshToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await AuthService.loginUser(email, password);
      res.json({ user, token, refreshToken });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;