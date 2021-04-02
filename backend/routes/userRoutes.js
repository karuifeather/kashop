import express from 'express';

import {
  login,
  protect,
  restrictToAdmin,
  signup,
} from '../controllers/authController.js';
import { getAllUsers, getMe, updateMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.route('/profile').get(protect, getMe).patch(protect, updateMe);

router.route('/').post(signup).get(protect, restrictToAdmin, getAllUsers);

export default router;
