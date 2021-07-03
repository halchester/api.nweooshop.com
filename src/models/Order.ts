import mongoose from "mongoose";
import { ProductDocument } from "./Product";
import { UserDocument } from "./User";
import { ShopDocument } from "./Shop";
import { nanoid } from "nanoid";

export type OrderDocument = mongoose.Document & {
  orderId: string;
  shopId: ShopDocument;
  paymentStatus: number; // 0 for no cash, 1 to cash
  product: ProductDocument;
  itemPrice: number;
  itemCount: number;
  status: string; // 'pending', 'confirmed', 'processing', 'take out', 'shipped'
  customer: UserDocument;
  remarks: string;
  deliveryFee: number;
};

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    paymentStatus: { type: Number },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    itemPrice: { type: Number, required: true },
    itemCount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remarks: { type: String },
    orderId: { type: String },
    deliveryFee: { type: Number, required: true }, // if free set 0
  },
  { timestamps: true }
);

orderSchema.pre("save", function save(next) {
  const order = this as OrderDocument;

  order.orderId = `NOS-${nanoid(4)}`;
  next();
});

const Order = mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;
