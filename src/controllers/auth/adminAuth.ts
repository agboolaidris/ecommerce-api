import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { User } from "../../models/user";

export const AdminRegister = async (req: Request, res: Response) => {
  try {
    let { username, email, password, mobile } = req.body;
    const adminProps: any = {
      username,
      email,
      password,
      role: "admin",
    };
    if (mobile) {
      adminProps["mobile"] = mobile;
    }

    const newAdmin = new User(adminProps);
    await newAdmin.save();
    return res.json({ msg: "register successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const AdminLogin = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ email: "email is invalid" });

    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword)
      return res.status(400).json({ password: "password is invalid" });

    if (user.role !== "admin")
      return res.status(400).json({ error: "only admin is authorized" });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ error: "jwt_secret is no provided" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.set(
      "Set-Cookie",
      cookie.serialize("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    return res.json({ msg: "login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const AdminLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access-token").json({ msg: "logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const AdminIsMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
