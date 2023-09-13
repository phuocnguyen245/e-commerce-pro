import express from "express";
import shopController from "../controllers/shop.controller.ts";
const router = express.Router();

router.post("/login", shopController.signUP);
export default router;
