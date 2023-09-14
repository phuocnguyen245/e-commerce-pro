import { Types } from "mongoose";
import KeyTokens from "../models/keyToken.model.ts";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshToken?: string;
  }) => {
    const filter = { userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokenUsed: [],
      refreshToken,
    };
    const option = {
      upsert: true,
      new: true,
    };
    const tokens = await KeyTokens.findOneAndUpdate(filter, update, option);

    return tokens ? tokens.publicKey : null;
  };
  static findByUserId = async (userId: string) => {
    const key = KeyTokens.findOne({
      userId: new Types.ObjectId(userId),
    }).lean();
    return key;
  };
}

export default KeyTokenService;
