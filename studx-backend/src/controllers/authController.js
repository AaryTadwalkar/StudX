import bcrypt from "bcryptjs";
import User from "../models/User.js";
import EmailOTP from "../models/EmailOTP.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { name, year, branch, prn, email, phone, password } = req.body;

    if (!email.endsWith("@vit.edu")) {
      return res.status(400).json({ message: "Only @vit.edu emails allowed" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, year, branch, prn, email, phone,
      passwordHash: hashed
    });

    const otp = generateOTP();

    await EmailOTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const record = await EmailOTP.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await User.updateOne({ email }, { isEmailVerified: true });
  await EmailOTP.deleteMany({ email });

  res.json({ message: "Email verified successfully" });
};