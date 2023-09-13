import { Request } from "express";
import Shops from "../models/shop.model.ts";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import tokenKeyService from "./tokenKey.service.ts";
import { createTokenPair } from "../authUtils/authUtils.ts";

const ROlE = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  signUP = async (req: Request) => {
    try {
      const { name, email, password } = req.body;
      const holderShop = await Shops.findOne({
        email,
      }).lean();
      if (holderShop) {
        return {
          message: "Email already exists",
        };
      }

      console.log(name, email, password);
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await Shops.create({
        name,
        email,
        password: passwordHash,
        roles: [ROlE.SHOP],
      });

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keysStore = await tokenKeyService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keysStore) {
          return {
            message: "keysStore error",
          };
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey as string,
          privateKey
        );

        console.log(tokens);

        return {
          code: 201,
          data: {
            shop: newShop,
            tokens,
          },
        };
      }
    } catch (error) {
      return error;
    }
  };
}

export default new AuthService();
