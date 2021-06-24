import mongoose from "mongoose";
import { PaymentDocument } from "./Payment";
import { ProductDocument } from "./Product";
import { UserDocument } from "./User";
import { ShopDocument } from "./Shop";
import { nanoid } from "nanoid";

export type OrderDocument = mongoose.Document & {
  orderId: string;
  shopId: ShopDocument;
  transcation: object;
  isDigitalCash: boolean;
  paymentStatus: number; // 0 for no cash, 1 to cash
  productName: string;
  productUniqueId: string; // product unique Id nk product detail ko pym kyi ml
  products: ProductDocument[];
  itemPrice: number;
  itemCount: number;
  status: string; // 'pending', 'confirmed', 'processing', 'take out', 'shipped'
  customer: UserDocument;
  remarks: string;
};

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    isDigitalCash: { type: Boolean, required: true },
    transaction: {
      paymentType: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
      transactionId: { type: String },
      transactionUsername: { type: String },
    },
    productName: { type: String, required: true },
    paymentStatus: { type: Number },
    productUniqueId: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    itemPrice: { type: Number, required: true },
    itemCount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remarks: { type: String },
    orderId: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", function save(next) {
  const order = this as OrderDocument;

  order.orderId = `NS_${nanoid(6)}`;
  next();
});

const Order = mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;
