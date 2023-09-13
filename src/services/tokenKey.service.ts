import { Types } from "mongoose";
import KeyTokens from "../models/keyToken.model.ts";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
  }: {
    userId: Types.ObjectId;
    publicKey: string;
    privateKey: string;
  }) => {
    try {
      const tokens = await KeyTokens.create({
        userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
