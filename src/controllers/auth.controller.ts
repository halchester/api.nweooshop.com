import { Request, Response } from "express";
import User from "../models/User";
import UserInfo from "../models/UserInfo";
import Shop from "../models/Shop";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import slugify from "slugify";
require("dotenv").config();

/**
 * @route /api/register
 * @method POST
 * @description create a new user
 */
export const register = async (req: Request, res: Response) => {
  const { shopName, city, state, stateId } = req.body;
  try {
    let newUser = new User(req.body);
    await newUser.save();

    if (newUser?.userType?.toLowerCase() === "seller") {
      let newShop = new Shop({
        shopName,
        city,
        state,
        stateId,
        slug: slugify(shopName, {
          replacement: "-",
          lower: true,
          strict: false,
        }),
        _user: newUser?._id,
      });
      await newShop.save();
    }
    newUser;

    return res.status(200).json({ success: true, data: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/**
 * @route /api/authenticate
 * @method POST
 * @description login api for user
 */
export const authenticate = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("-_id -__v");

  if (!user)
    return res
      .status(404)
      .json({ success: false, data: "User does not exist" });

  if (user) {
    bcrypt.compare(
      password,
      user.password,
      async (err: mongoose.Error, isMatch: boolean) => {
        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, data: "Email or Password is incorrect" });
        }
        if (isMatch) {
          var token = jwt.sign(
            { credentials: `${user._id}.${user.fullName}.${user.email}` },
            process.env.jwtSecret,
            {}
          );

          let getUserInfo = await UserInfo.findOne({ user: user._id });

          const credentials = {
            _id: user._id,
            fullname: user.fullName,
            email: user.email,
            city: getUserInfo?.city,
            state: getUserInfo?.state,
            address: getUserInfo?.address,
            type: user.userType,
            phoneNumbers: getUserInfo?.phoneNumbers,
            token: token,
          };
          return res.status(200).json({ success: true, data: credentials });
        }
      }
    );
  } else {
    return res
      .status(401)
      .json({ success: false, data: "Email or Password is incorrect" });
  }
};

/**
 * @route /api/buyer/register
 * @method POST
 * @description create a new buyer account
 */
export const buyerRegister = async (req: Request, res: Response) => {
  const { fullName, email, password, city, state, address, phoneNumbers } =
    req.body;
  try {
    let newBuyer = new User({
      fullName,
      email,
      password,
      userType: "buyer",
    });
    await newBuyer.save();

    if (newBuyer) {
      let saveUserInfo = new UserInfo({
        user: newBuyer?._id,
        city,
        state,
        address,
        phoneNumbers,
        isEmailVerify: false,
      });

      await saveUserInfo.save();

      if (saveUserInfo) {
        var token = jwt.sign(
          {
            credentials: {
              _id: newBuyer._id,
              fullname: newBuyer.fullName,
              email: newBuyer.email,
              city: saveUserInfo.city,
              state: saveUserInfo.state,
              address: saveUserInfo?.address,
              phoneNumbers: saveUserInfo?.phoneNumbers,
            },
          },
          process.env.jwtSecret,
          {}
        );

        return res.status(200).json({ success: true, data: token });
      }

      return res.status(500).json({
        success: false,
        data: "There was en error while creating your account",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/**
 * @route /api/buyer/login
 * @method POST
 * @description authenticate buyer account
 */

export const buyerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("-__v");

  if (!user)
    return res
      .status(404)
      .json({
        success: false,
        data: `${email} is not found. If you are a new member, please register first`,
      });

  if (user) {
    bcrypt.compare(
      password,
      user.password,
      async (err: mongoose.Error, isMatch: boolean) => {
        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, data: "Email or Password is incorrect" });
        }
        if (isMatch) {
          let findUserInfo = await UserInfo.findOne({ user: user?._id });

          var token = jwt.sign(
            {
              credentials: {
                _id: user._id,
                fullname: user.fullName,
                email: user.email,
                city: findUserInfo?.city,
                state: findUserInfo?.state,
                address: findUserInfo?.address,
                phoneNumbers: findUserInfo?.phoneNumbers,
              },
            },
            process.env.jwtSecret,
            {}
          );
          return res.status(200).json({ success: true, data: token });
        }
      }
    );
  } else {
    return res
      .status(401)
      .json({ success: false, data: "Email or Password is incorrect" });
  }
};

/**
 * @route /api/auth/refresh
 * @method POST
 * @description refresh Function, will return new Authorization token everytime we call
 */

export const refresh = async (req: Request, res: Response) => {
  const { credentials } = req as any;

  try {
    if (credentials) {
      var token = jwt.sign(
        {
          credentials: {
            _id: credentials._id,
            fullname: credentials.fullName,
            email: credentials.email,
            city: credentials.city,
            state: credentials.state,
            address: credentials?.address,
            phoneNumbers: credentials?.phoneNumbers,
          },
        },
        process.env.jwtSecret,
        {}
      );

      return res.status(200).json({ Authorization: token });
    }
  } catch (error) {
    return res.status(400).json({ Authorization: null });
  }
};
