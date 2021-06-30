import mongoose from "mongoose";
import { UserDocument } from "./User";

export type UserInfoDocument = mongoose.Document & {
  user: UserDocument;
  city: string;
  state: string;
  address: string;
  phoneNumbers: string[];
  isEmailVerify: boolean;
};

const userInfoSchema = new mongoose.Schema<UserInfoDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumbers: [{ type: String, required: true }],
    isEmailVerify: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserInfo = mongoose.model<UserInfoDocument>("UserInfo", userInfoSchema);

export default UserInfo;
