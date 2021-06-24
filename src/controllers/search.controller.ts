import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * @route /api/search
 * @method POST
 * @description search products
 */

export const search = async (req: Request, res: Response) => {
  
  const {q} = req.query as any;

  try {
    let searchProducts = await Product.find({
      $text: { $search: q },
    });

    if (!searchProducts) {
      return res
        .status(404)
        .json({ success: false, data: "No matching with your search" });
    }

    return res.status(200).json({ success: true, data: searchProducts });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error" });
  }
};
