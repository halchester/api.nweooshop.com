import mongoose from "mongoose";
import { UserDocument } from "./User";
import { nanoid } from "nanoid";

export type ShopDocument = mongoose.Document & {
  shopName: string;
  shortBio: string;
  slug: string;
  _user: UserDocument;
  city: string;
  state: string;
  stateId: number;
  uniqueId: string;
  shopProfile: string;
  shopCoverPhoto: string;
  phoneNumbers: string[];
};

const shopSchema = new mongoose.Schema<ShopDocument>(
  {
    shopName: {
      type: String,
      trim: true,
      required: true,
    },
    shortBio: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: { type: String },
    state: { type: String },
    stateId: { type: Number },
    uniqueId: { type: String },
    shopProfile: { type: String },
    shopCoverPhoto: { type: String },
    phoneNumbers: [{ type: Array }],
  },
  { timestamps: true }
);

shopSchema.pre("save", function save(next) {
  const shop = this as ShopDocument;

  shop.uniqueId = nanoid(6);
  next();
});

shopSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});
const Shop = mongoose.model<ShopDocument>("Shop", shopSchema);

export default Shop;
