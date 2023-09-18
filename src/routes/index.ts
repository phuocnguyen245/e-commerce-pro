import express from "express";
import shop from "./shop.router.ts";
import product from "./product/index.ts";
const router = express.Router();
import { apiKey, permission } from "../authUtils/checkAuth.ts";

router.use(apiKey);
router.use(permission("0000") as any);

router.use("/shop", shop);
router.use("/product", product);

export default router;
