import express from "express";
import { apiKey, permission } from "../authUtils/checkAuth.ts";
import shopController from "../controllers/shop.controller.ts";
import { asyncHandler } from "../utils/helpers/asyncHandler.ts";
import { verifyToken } from "../authUtils/authUtils.ts";
const router = express.Router();

router.post(
  "/register",
  apiKey,
  permission("0000") as any,
  asyncHandler(shopController.signUP)
);

router.post(
  "/login",
  apiKey,
  permission("0000") as any,
  asyncHandler(shopController.signIn)
);

// authen 
router.use(verifyToken)


export default router;
