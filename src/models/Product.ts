import mongoose from "mongoose";
import { UserDocument } from "./User";
import { ShopDocument } from "./Shop";
import { CategoryDocument } from "./Category";
import { PaymentDocument } from "./Payment";
import { nanoid } from "nanoid";
import slugify from "slugify";

export type ProductDocument = mongoose.Document & {
  title: string;
  description: string;
  slug: string;
  _user: UserDocument;
  _shop: ShopDocument;
  uniqueId: string;
  productImages: string[];
  tags: string[];
  price: string;
  estimatedPrice: number;
  delivery: string;
  payment: PaymentDocument[];
  _category: CategoryDocument;
  categoryId: string;
};

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    slug: { type: String },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    _shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    uniqueId: { type: String },
    productImages: [
      {
        type: String,
      },
    ],
    tags: [{ type: String }],
    price: { type: String },
    estimatedPrice: { type: Number, required: true },
    delivery: { type: String },
    payment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    _category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    categoryId: { type: String },
  },
  {timestamps: true}
);

productSchema.index({ tags: "text", title: "text", description: "text" });

productSchema.pre("save", function save(next) {
  const product = this as ProductDocument;

  product.uniqueId = nanoid(6);
  product.slug = slugify(this.title, {
    replacement: "-",
    lower: true,
    strict: false,
  });
  next();
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
