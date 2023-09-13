import express from "express";
import shop from "./shop.router.ts";
const router = express.Router();

router.use("/shop", shop);
export default router;
