import { Types } from "mongoose";
import { Products, Electronics, Clothes } from "../product.model.ts";
import { NotFoundRequestError } from "../../core/error.response.ts";

interface QueryAllParams {
  query: any;
  limit: number;
  skip: number;
}

const findAllDraftByShopId = async (params: QueryAllParams) =>
  await queryProduct(params);

const findAllPublishByShopId = async (params: QueryAllParams) =>
  await queryProduct(params);

const findProductByShopId = async ({
  product_shopId,
  product_id,
}: {
  product_shopId: string;
  product_id: string;
}) => {
  const products = await Products.findOne({
    product_shopId: new Types.ObjectId(product_shopId),
    _id: new Types.ObjectId(product_id),
  });
  if (!products) {
    throw new NotFoundRequestError("Product not found");
  }
  return products;
};

const queryProduct = async ({ query, skip, limit }: QueryAllParams) => {
  return await Products.find(query)
    .populate("product_shopId", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProduct = async (search: string) => {
  const regex = new RegExp(`.*${search}.*`);
  return await Products.find({
    $or: [{ product_name: regex }, { product_desc: regex }],
    $and: [{ isPublished: true, isDraft: false }],
  }).lean();
};

export {
  findAllDraftByShopId,
  findAllPublishByShopId,
  findProductByShopId,
  searchProduct,
};
