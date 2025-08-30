import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../Models/UserModel.js";
import { comparePassword } from "../Helpers/Auth.js";

dotenv.config();


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Email not registered" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" },
    );
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
