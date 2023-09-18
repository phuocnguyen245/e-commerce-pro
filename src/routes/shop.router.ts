import express from "express";
import shopController from "../controllers/shop.controller.ts";
import { asyncHandler } from "../utils/helpers/asyncHandler.ts";
import { authentication } from "../authUtils/authUtils.ts";
const router = express.Router();

router.post("/register", asyncHandler(shopController.signUP));

router.post("/login", asyncHandler(shopController.signIn));

// authentication
router.use(authentication);
router.get("/logout", asyncHandler(shopController.logout));
router.post("/refresh-token", asyncHandler(shopController.refreshToken));

export default router;
