import { Request, Response } from "express";
import Order from "../models/Order";
/**
 * @route /api/order
 * @method POST
 * @description create order from buyer to seller
 */

export const create = async (req: Request, res: Response) => {
  let { credentials } = req as any;
  const {
    shopId,
    transaction,
    productUniqueId,
    isDigitalCash,
    products,
    remarks,
    itemPrice,
    itemCount,
    productName,
  } = req.body as any;
  try {
    let newOrder = new Order({
      shopId,
      transaction,
      productName,
      productUniqueId,
      isDigitalCash,
      products,
      paymentStatus: isDigitalCash ? 1 : 0,
      itemPrice,
      itemCount,
      customer: credentials._id,
      remarks,
    });

    await newOrder.save();

    return res.status(200).json({ success: true, data: newOrder });
  } catch (error) {
    console.log('err', error)
    return res.status(500).json({ success: false, data: "Error" });
  }
};
