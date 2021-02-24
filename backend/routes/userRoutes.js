import express from 'express';

import { login, protect, signup } from '../controllers/authController.js';
import { getMe, updateMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.route('/profile').get(protect, getMe).patch(protect, updateMe);

router.route('/').post(signup);

export default router;
