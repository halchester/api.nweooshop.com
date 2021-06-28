import { Request, Response } from "express";
import Delivery from "../models/Delivery";
/**
 * @route /api/delivery
 * @method POST
 * @description create delivery price in shop
 */

export const create = async (req: Request, res: Response) => {
  const { shopId, delivery } = req.body as any;
  try {
    let newDelivery = new Delivery({
      shopId,
      delivery,
    });

    await newDelivery.save();

    return res.status(200).json({ success: true, data: newDelivery });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ success: false, data: "Error" });
  }
};
