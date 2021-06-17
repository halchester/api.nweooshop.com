import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * @route /api/products
 * @method GET
 * @description fetch products by custom limit
 */

export const index = async (req: Request, res: Response) => {
  let { limit } = req.query as any;

  await Product.find()
    .populate(
      "_user",
      "-email -password -userType -_id -createdAt -updatedAt -__v"
    )
    .populate("_shop", "-_id -_user -createdAt -updatedAt -__v")
    .populate("_category", "-_id -updatedAt -createdAt -__v")
    .limit(limit)
    .sort({ createdAt: -1 })
    .then((products) => {
      return res.status(200).json({ success: true, data: products });
    })
    .catch((error) => {
      return res.status(500).json({ success: true, data: "Error" });
    });
};

/**
 * @route /api/products/lastest?limit=5
 * @method GET
 * @description fetch lastest products by created Date
 */

export const lastest = async (req: Request, res: Response) => {
  let { limit } = req.query as any;

  let limitting = parseInt(limit);

  await Product.find()
    .populate("_shop", "-_id -_user -createdAt -updatedAt -__v")
    .limit(limitting || 8)
    .sort({ _id: -1 })
    .then((products) => {
      return res.status(200).json({ success: true, data: products });
    })
    .catch((error) => {
      return res.status(500).json({ success: true, data: "Error" });
    });
};

/**
 * @route /api/products/:uniqueId
 * @method GET
 * @description fetch product detail by uniqueId
 */

export const detail = async (req: Request, res: Response) => {
  let { uniqueId } = req.params as any;

  await Product.findOne({ uniqueId })
    .populate(
      "_user",
      "-email -password -userType -_id -createdAt -updatedAt -__v"
    )
    .populate("_shop", "-_id -_user -createdAt -updatedAt -__v")
    .then((product) => {
      return res.status(200).json({ success: true, data: product });
    })
    .catch((error) => {
      return res.status(500).json({ success: true, data: "Error" });
    });
};

/**
 * @route /api/product
 * @method POST
 * @description create product
 */

export const create = async (req: Request, res: Response) => {
  try {
    let newProduct = new Product(req.body);
    await newProduct.save();

    return res.status(200).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ success: true, data: "Error" });
  }
};