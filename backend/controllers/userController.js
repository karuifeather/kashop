import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get logged in user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  return res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
  });
});

// @desc    Update user profile
// @route   PATCH /api/v1/users/profile
// @access  Private
export const updateMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (req.body.password) {
    return next(
      new AppError('This route is not used for updating password.', 403)
    );
  }

  Object.keys(req.body).forEach((curr) => (user[curr] = req.body[curr]));

  const newUser = await user.save({ validateBeforeSave: true });

  return res.status(202).json({
    status: 'success',
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    },
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// @desc    Delete user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await user.remove();

  return res.status(200).json({
    status: 'success',
    data: 'User was removed successfully.',
  });
});
