import express from "express";
import { apiKey, permission } from "../authUtils/checkAuth.ts";
import shopController from "../controllers/shop.controller.ts";
import { asyncHandler } from "../utils/helpers/asyncHandler.ts";
import { authentication } from "../authUtils/authUtils.ts";
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

// authentication
router.use(authentication);
router.get(
  "/logout",
  apiKey,
  permission("0000") as any,
  asyncHandler(shopController.logout)
);
router.post(
  "/refresh-token",
  apiKey,
  permission("0000") as any,
  asyncHandler(shopController.refreshToken)
);

export default router;
