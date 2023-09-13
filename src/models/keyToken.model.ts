import { Schema, Types, model } from "mongoose";
interface IKeyToken {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken: any;
}

const NAME = {
  DOCUMENT: "KeyToken",
  COLLECTION: "KeyTokens",
};
const KeyTokenSchema = new Schema<IKeyToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      maxLength: 150,
      ref: "Shop",
    },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    refreshToken: {
      type: Array,
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: NAME.COLLECTION,
  }
);
const KeyTokens = model<IKeyToken>(NAME.DOCUMENT, KeyTokenSchema);
export default KeyTokens;
