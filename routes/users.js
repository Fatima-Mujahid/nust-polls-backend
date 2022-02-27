import express from 'express';
import {
  loginUser,
  forgotPassword,
  resetPassword,
} from '../controllers/users.js';

const router = express.Router({ mergeParams: true });

//LOGIN ROUTE
/**
 * @route   POST /user/login
 * @desc    Login user with username and password
 * @body    {username, password}
 */
router.post('/login', loginUser);

//FORGOT PASSWORD
/**
 * @route   POST /user/password/forgot
 * @desc    Forgot password, send email to reset
 * @body    {email}
 */
router.post('/password/forgot', forgotPassword);

//RESET PASSWORD
/**
 * @route   PUT /user/password/reset
 * @desc    Reset password after forgot
 * @body    {password}
 */
router.put('/password/reset/:resetToken', resetPassword);

export default router;