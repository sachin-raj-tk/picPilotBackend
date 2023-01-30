import UserModel from "../Models/userModel.js";
import OtpModel from "../Models/OtpModel.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpVerificationEmail } from "../services/nodemailer.js";

// Registering a new user
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  req.body.verified = false;
  const newUser = new UserModel(req.body);
  const { username } = req.body;
  try {
    const oldUser = await UserModel.findOne({ username });

    if (oldUser) {
      return res
        .status(400)
        .json({ message: "username is already registered" });
    }
    const user = await newUser.save();
    await sendOtpVerificationEmail(user, res);
    console.log(user, "register user");

    // res.status(200).json({
    //   status: "PENDING",
    //   message: "User email verification pending",
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login User

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
        if(!user.verified){
            return res.status(400).json("user otp not verified")
        }
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const active = user.active
        if(!active){
          return res.status(400).json("you has been blocked")
        }
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "2h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify otp email

export const verifyotp = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const userOTPVerificationRecords = await OtpModel.find({ userId });
      if (userOTPVerificationRecords.length <= 0) {
        //no records found
        throw new Error(
          "Account record doesn't exist or have been verified already, Please signup or login"
        );
      } else {
        const { expiresAt } = userOTPVerificationRecords[0];
        const hashedOTP = userOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          //user otp record has expired
          await OtpModel.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            // supplied otp is wrong
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            // UserModel.updateOne({_id:userId},{verified:true})
            await UserModel.findOneAndUpdate(
              { _id: userId },
              { $set: { verified: true } }
            );
            const user = await UserModel.findById({ _id: userId });
            console.log(user);
            await OtpModel.deleteMany({ userId });
            const token = jwt.sign(
              {
                username: user.username,
                id: user._id,
              },
              process.env.JWT_KEY,
              { expiresIn: "2h" }
            );
            res.status(200).json({ user, token });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// resend verification otp during signup

export const resendotp = async (req, res) => {
  try {
    let { userId, username } = req.body;

    if (!userId || !username) {
      throw Error("Empty user details are not allowed");
    } else {
      // delete existing records and resend
      await OtpModel.deleteMany({ userId });
      sendOtpVerificationEmail({ _id: userId, username: username }, res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};
