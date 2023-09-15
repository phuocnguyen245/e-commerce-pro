import { Schema, model } from "mongoose";
import { IProduct } from "../types/models.ts";

const NAME = {
  DOCUMENT: "Product",
  COLLECTION: "Products",
};

const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_des: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothes", "Food", "Drink", "Furniture", "Other"],
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: NAME.COLLECTION,
  }
);

const clothesSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);
const ElectronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

const Products = model<IProduct>(NAME.DOCUMENT, productSchema);
const Clothes = model("Clothes", clothesSchema);
const Electronics = model("Electronics", ElectronicSchema);
export { Products, Clothes, Electronics };
