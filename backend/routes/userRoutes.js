import express from 'express';

import {
  login,
  protect,
  restrictToAdmin,
  signup,
} from '../controllers/authController.js';
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUserById,
  updateMe,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.route('/profile').get(protect, getMe).patch(protect, updateMe);

router.route('/').post(signup).get(protect, restrictToAdmin, getAllUsers);
router
  .route('/:id')
  .get(protect, restrictToAdmin, getUserById)
  .patch(protect, restrictToAdmin, updateUser)
  .delete(protect, restrictToAdmin, deleteUser);

export default router;
