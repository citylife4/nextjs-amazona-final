import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const signup = nextConnect({
  onError,
});

signup.post(async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 8);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
    });

    await db.connect();
    const newUser = await user.save();
    await db.disconnect();
    if (newUser) {
      const token = signToken(newUser);
      res.status(200).json({
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: token,
      });
    } else {
      res.status(401).send({ message: 'User Data not available.' });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

export default signup;
