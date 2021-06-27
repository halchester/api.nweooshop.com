import { Request, Response } from "express";
import Shop from "../models/Shop";

/**
 * @route /api/shops
 * @method GET
 * @description fetch shops by custom limit
 */

export const index = async (req: Request, res: Response) => {
  let { limit } = req.query as any;

  let limitting = parseInt(limit);

  await Shop.find()
    .limit(limitting || 10)
    .sort({ createdAt: -1 })
    .then((shops) => {
      return res.status(200).json({ success: true, data: shops });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, data: "Error" });
    });
};

/**
 * @route /api/shops/:id
 * @method GET
 * @description fetch shop detail by uniqueId
 */

export const detail = async (req: Request, res: Response) => {
  let { id } = req.params as any;

  await Shop.findOne({ _id: id })
    .then((shop) => {
      return res.status(200).json({ success: true, data: shop });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ success: false, data: "Error" });
    });
};
