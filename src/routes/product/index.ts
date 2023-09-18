import express from "express";
import { authentication } from "../../authUtils/authUtils.ts";
import ProductController from "../../controllers/product.controller.ts";
import { asyncHandler } from "../../utils/helpers/asyncHandler.ts";
const router = express.Router();

router.get("/search", asyncHandler(ProductController.getListSearchProduct));

//authentication
router.use(authentication);

router.post("", asyncHandler(ProductController.createProduct));
router.get("/draft", asyncHandler(ProductController.findAllDraftByShopId));
router.get(
  "/published",
  asyncHandler(ProductController.findAllPublishByShopId)
);
router.put(
  "/published/:id",
  asyncHandler(ProductController.publishProductByShopId)
);

export default router;
