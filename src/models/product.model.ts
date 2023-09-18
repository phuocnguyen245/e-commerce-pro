import { Schema, model } from "mongoose";
import { IProduct } from "../types/models.ts";
import { convertToSlug } from "../utils/helpers/convertToSlug.ts";
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
    product_desc: {
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
    //...
    product_slug: {
      type: String,
      unique: true,
    },
    product_arrange: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must be at most 5"],
      set: (v: number) => Math.round(v * 10) / 10,
    },
    product_variation: {
      type: Schema.Types.Mixed,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      // select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      // select: false,
    },
  },
  {
    timestamps: true,
    collection: NAME.COLLECTION,
  }
);

productSchema.pre<IProduct>("save", function (next) {
  this.product_slug = convertToSlug(this.product_name);
  next();
});

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
    shopId: Schema.Types.ObjectId,
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
