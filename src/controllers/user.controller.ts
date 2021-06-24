import { Request, Response } from "express";
import User from "../models/User";
import UserInfo from "../models/UserInfo";
import Order from "../models/Order";
/**
 * @route /api/auth/user
 * @method GET
 * @description fetch current User
 */

export const authUser = async (req: Request | any, res: Response) => {
  try {
    if (req.credentials)
      return res.status(200).json({ success: true, data: req.credentials });
  } catch (error) {
    return res.status(400).json({ success: false, data: "Invalid Token!" });
  }
};

/**
 * @route /api/buyer/:id/orders
 * @method GET
 * @description fetch auth user's order list
 */

export const getBuyerOrders = async (req: Request | any, res: Response) => {
  const { credentials } = req as any;

  if(credentials){
    await Order.find({ customer: credentials._id })
    .populate("customer", "-password -userType -createdAt -updatedAt -__v")
    .populate("shop")
    .populate("products", "-payment -categoryId -category -shop -user")
    .populate("transaction.paymentType", "-_id -createdAt -updatedAt -__v")
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      console.log(error)
      return res
        .status(500)
        .json({ success: false, data: "Error while fetching orders" });
    });
  }
};
