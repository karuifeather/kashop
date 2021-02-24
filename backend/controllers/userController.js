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
