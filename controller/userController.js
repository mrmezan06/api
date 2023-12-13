const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
/* 
*
@desc Register a user
@route POST /api/v1/users/register
@access Public
*
*/

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hash,
    });

    if (user) {
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/*
*
@desc Login a user
@route POST /api/v1/users/login
@access Public
*
*/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Please provide email',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Please provide password',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Wrong password!',
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  register,
  login,
};
