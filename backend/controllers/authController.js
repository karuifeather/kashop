import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/userModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Remove unwanted data from the object
  user.password = undefined;
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;

  if (process.env.NODE_ENV === 'production') {
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
  }

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser, 201, req, res);
});

// @desc    Auth user & get token
// @route   POST /api/v1/users/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 If email and password don't exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2 If email user exists && password is correct, continue
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3 If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

export const protect = asyncHandler(async (req, res, next) => {
  // 1 Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You're not logged in. Log in to continue.", 401));
  }

  // 2 Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_PRIVATE);

  // 3 Check if user still exists
  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists!', 401)
    );
  }

  // Grant access to the protected route
  req.user = currentUser;
  next();
});
