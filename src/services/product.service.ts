import { Document, Types } from "mongoose";
import { Clothes, Electronics, Products } from "../models/product.model.ts";
import { IProduct } from "../types/models.js";
import { BadRequestError } from "../core/error.response.ts";
import {
  findAllDraftByShopId,
  findProductByShopId,
  findAllPublishByShopId,
  searchProduct,
} from "../models/repo/product.repo.ts";

class ProductFactory {
  static ProductType: any = {};
  static addProductType(type: string, serviceClass: any) {
    this.ProductType[type] = serviceClass;
  }

  static async createProduct(type: string, payload: any) {
    const productType = this.ProductType[type];
    if (!productType) {
      return new BadRequestError("Cannot create product");
    }
    return await new productType(payload).createProduct();
  }

  static async findAllDraftByShopId({
    product_shopId,
    limit = 50,
    skip = 0,
  }: {
    product_shopId: string;
    limit?: number;
    skip?: number;
  }) {
    const query = { product_shopId, isDraft: true };
    console.log("vao day");

    return await findAllDraftByShopId({ query, limit, skip });
  }

  static async findAllPublishByShopId({
    product_shopId,
    limit = 50,
    skip = 0,
  }: {
    product_shopId: string;
    limit?: number;
    skip?: number;
  }) {
    const query = { product_shopId, isPublished: true };
    return await findAllPublishByShopId({ query, limit, skip });
  }

  static async findProductByShopId({
    product_shopId,
    product_id,
  }: {
    product_shopId: string;
    product_id: string;
  }) {
    return await findProductByShopId({ product_id, product_shopId });
  }

  static async publishProductByShopId({
    product_shopId,
    product_id,
  }: {
    product_shopId: string;
    product_id: string;
  }) {
    const product = await findProductByShopId({ product_id, product_shopId });

    const updatedProduct = {
      isPublished: !product.isPublished,
      isDraft: !product.isDraft,
    };

    return await product.updateOne(updatedProduct);
  }

  static async searchProduct(search: string) {
    return searchProduct(search);
  }
}

class Product {
  product_name: any;
  product_thumb: any;
  product_des: any;
  product_price: any;
  product_quantity: any;
  product_shopId: any;
  product_type: any;
  product_attributes: any;
  constructor({
    product_name,
    product_thumb,
    product_desc,
    product_price,
    product_quantity,
    product_shopId,
    product_type,
    product_attributes,
  }: IProduct) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_des = product_desc;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_shopId = product_shopId;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
  }

  async createProduct(id: Types.ObjectId) {
    return await Products.create({
      ...this,
      _id: id,
    });
  }
}

class ClothesServices extends Product {
  async createProduct(): Promise<
    Document<unknown, {}, IProduct> & IProduct & { _id: Types.ObjectId }
  > {
    const newClothes = await Clothes.create({
      ...this.product_attributes,
      shopId: this.product_shopId,
    });
    if (!newClothes) {
      throw new BadRequestError("Cannot create clothes");
    }
    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct) {
      throw new BadRequestError("Cannot create product");
    }
    return newProduct;
  }
}

class ElectronicService extends Product {
  async createProduct(): Promise<
    Document<unknown, {}, IProduct> & IProduct & { _id: Types.ObjectId }
  > {
    const newClothes = await Electronics.create({
      ...this.product_attributes,
      product_shopId: this.product_shopId,
    });

    if (!newClothes) {
      throw new BadRequestError("Cannot create electronic");
    }

    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct) {
      throw new BadRequestError("Cannot create electronic");
    }
    return newProduct;
  }
}

ProductFactory.addProductType("Clothes", ClothesServices);
ProductFactory.addProductType("Electronic", ElectronicService);

export default ProductFactory;
