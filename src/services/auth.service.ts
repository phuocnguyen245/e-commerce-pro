import bcrypt from "bcrypt";
import { Request } from "express";
import { verifyToken, createTokenPair } from "../authUtils/authUtils.ts";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenRequestError,
  NotFoundRequestError,
  UnauthorizeRequestError,
} from "../core/error.response.ts";
import Shops from "../models/shop.model.ts";
import { generateKey, pickKeysInObject } from "../utils/index.ts";
import { findByEmail } from "./shop.service.ts";
import tokenKeyService from "./tokenKey.service.ts";
import KeyTokenService from "./tokenKey.service.ts";
import { IKeyToken } from "../types/models.js";

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
  signOut = async (id: string) => {
    const delKey = await KeyTokenService.removeKeyById(id);
    return delKey;
  };
  handleRefreshToken = async ({
    refreshToken,
    keyStore,
    user,
  }: {
    refreshToken: string;
    keyStore: IKeyToken;
    user: { userId: string; email: string };
  }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenRequestError(
        "Something went wrong, please login again"
      );
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new BadRequestError("Invalid refresh token");
    }

    const shop = await findByEmail({ email });
    if (!shop) {
      throw new NotFoundRequestError("Shop not found");
    }
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await KeyTokenService.updateTokenById(
      keyStore.refreshToken,
      tokens.refreshToken
    );

    return {
      data: { ...user },
      tokens,
    };
  };
}

export default new AuthService();
