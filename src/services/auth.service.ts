import bcrypt from "bcrypt";
import { Request } from "express";
import { createTokenPair } from "../authUtils/authUtils.ts";
import {
  BadRequestError,
  ConflictRequestError,
  NotFoundRequestError,
} from "../core/error.response.ts";
import Shops from "../models/shop.model.ts";
import { generateKey, pickKeysInObject } from "../utils/index.ts";
import { findByEmail } from "./shop.service.ts";
import tokenKeyService from "./tokenKey.service.ts";
import KeyTokenService from "./tokenKey.service.ts";

const ROlE = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  signUP = async (req: Request) => {
    const { name, email, password } = req.body;
    const holderShop = await Shops.findOne({
      email,
    }).lean();
    if (holderShop) {
      throw new ConflictRequestError("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await Shops.create({
      name,
      email,
      password: passwordHash,
      roles: [ROlE.SHOP],
    }).then((data) => {
      return data.toObject();
    });

    if (newShop) {
      const privateKey = generateKey();
      const publicKey = generateKey();

      const keysStore = await tokenKeyService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keysStore) {
        throw new BadRequestError("keysStore error");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey as string,
        privateKey
      );

      return {
        data: pickKeysInObject({
          object: newShop,
          keys: ["_id", "name", "email", "roles"],
        }),
        tokens,
      };
    }
  };
  signIn = async (req: Request) => {
    const { email, password } = req.body;
    const shop = await findByEmail({ email });
    if (!shop) {
      throw new NotFoundRequestError("Shop not found");
    }
    const compare = await bcrypt.compare(password, shop.password);
    if (!compare) {
      throw new BadRequestError("Wrong email or password");
    }
    const privateKey = generateKey();
    const publicKey = generateKey();

    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey as string,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: shop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      data: pickKeysInObject({
        object: shop,
        keys: ["_id", "name", "email", "roles"],
      }),
      tokens,
    };
  };
}

export default new AuthService();
