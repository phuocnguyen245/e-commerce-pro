import { Types } from "mongoose";

interface IApiKey {
  key: string;
  status: Boolean;
  permissions: string[];
}
interface IKeyToken {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshTokenUsed: any;
  refreshToken: string;
}
interface IShop {
  name: string;
  email: string;
  password: string;
  status: string;
  verify: boolean;
  roles: any;
}
export { IKeyToken, IApiKey, IShop };
