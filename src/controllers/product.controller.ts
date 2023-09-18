import { Request, Response } from "express";
import { CREATED, OK } from "../core/success.response.ts";
import ProductService from "../services/product.service.ts";

class ProductController {
  static createProduct = async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(req.body.product_type, {
      ...req.body,
      product_shopId: (req as any).user.userId,
    });
    return new CREATED({
      data: result,
      message: "Create product success",
    }).send(res);
  };

  static findAllDraftByShopId = async (req: Request, res: Response) => {
    const result = await ProductService.findAllDraftByShopId({
      product_shopId: (req as any).user.userId,
    });
    return new OK({
      data: result,
      message: "Get list product daft success",
    }).send(res);
  };

  static findAllPublishByShopId = async (req: Request, res: Response) => {
    const result = await ProductService.findAllPublishByShopId({
      product_shopId: (req as any).user.userId,
    });

    return new OK({
      data: result,
      message: "Get list product publish success",
    }).send(res);
  };

  static publishProductByShopId = async (req: Request, res: Response) => {
    const result = await ProductService.publishProductByShopId({
      product_shopId: (req as any).user.userId,
      product_id: req.params.id,
    });
    return new OK({
      data: result,
      message: "Publish product success",
    }).send(res);
  };

  static getListSearchProduct = async (req: Request, res: Response) => {
    const result = await ProductService.searchProduct(String(req.query.search));
    return new OK({
      data: result,
      message: "Get list product search success",
    }).send(res);
  };
}
export default ProductController;
