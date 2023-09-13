import { Schema, model } from "mongoose";
interface IShop {
  name: string;
  email: string;
  password: string;
  status: string;
  verify: boolean;
  roles: any;
}

const NAME = {
  DOCUMENT: "Shop",
  COLLECTION: "Shops",
};
const shopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      required: true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: NAME.COLLECTION,
  }
);
const Shops = model<IShop>(NAME.DOCUMENT, shopSchema);
export default Shops;
