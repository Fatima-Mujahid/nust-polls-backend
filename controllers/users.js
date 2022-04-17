import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import Admin from '../models/admin.js';
import Student from '../models/student.js';
import sendEmail from '../utils/sendEmail.js';

//LOGIN CONTROLLER

const loginUser = async (req, res, next) => {
  await passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        res.status(404).json({ message: info?.message, success: false });
      } else {
        const { password, ..._user } = user.toObject();
        const token = jwt.sign(_user, process.env.JWT_SECRET_KEY);
        let response = {
          data: _user,
          token,
          message: 'Login successful',
          success: true,
        };
        if (user.role == 'admin') {
          try {
            const admin = await Admin.findOne({ admin: user._id })
              .populate('admin', '-password')
              .exec();
            if (!admin)
              return res.status(404).json({
                message: 'Admin does not exist',
                success: false,
              });
            res.status(200).json({ ...response, data: admin });
          } catch (err) {
            res.status(500).json({ message: err.message, success: false });
          }
        } else if (user.role == 'student') {
          try {
            const student = await Student.findOne({ student: user._id })
              .populate('student', '-password')
              .exec();
            if (!student)
              return res.status(404).json({
                message: 'Student does not exist',
                success: false,
              });
            res.status(200).json({ ...response, data: student });
          } catch (err) {
            res.status(500).json({ message: err.message, success: false });
          }
        } else {
          res.status(404).json({
            message: 'User does not exist',
            success: false,
          });
        }
      }
    }
  )(req, res, next);
};

//FORGOT PASSWORD CONTROLLER

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: 'Email is not correct',
        success: false,
      });
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/resetpassword/${resetToken}`;
    const message = `<h1>You have requested a password reset</h1><p>Please go to this link to reset your password</p><a href="${resetUrl}" clicktracking=off>${resetUrl}</a>`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });
      res.status(200).json({
        message: 'Email sent',
        success: true,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(404).json({
        message: 'Email can not be sent',
        success: false,
      });
    }
  } catch (err) {
    res.status(404).json({ message: err.message, success: false });
  }
};

//RESET PASSWORD CONTROLLER

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    try {
      await user.save();
      res.status(201).json({
        message: 'Password reset success',
        success: true,
      });
    } catch (err) {
      res.status(404).json({ message: err.message, success: false });
    }
  } catch (err) {
    res.status(400).json({
      message: 'Invalid token',
      success: false,
    });
  }
};

export { loginUser, forgotPassword, resetPassword };
