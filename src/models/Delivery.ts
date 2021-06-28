import mongoose from "mongoose";
import { ShopDocument } from "./Shop";

export type DeliveryDocument = mongoose.Document & {
  delivery: any; // prefer array
  shopId: ShopDocument;
};

const deliverySchema = new mongoose.Schema<DeliveryDocument>(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    delivery: [{ type: Object }], // [{name: 'Yankin', price: 1500}]
  },
  { timestamps: true }
);

const Delivery = mongoose.model<DeliveryDocument>("Delivery", deliverySchema);

export default Delivery;
