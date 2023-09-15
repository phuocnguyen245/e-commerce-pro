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

interface IProduct {
  product_name: string;
  product_thumb: string;
  product_des?: string;
  product_price: number;
  product_type: string;
  product_quantity: number;
  product_shopId: Types.ObjectId;
  product_attributes: any;
}
export { IKeyToken, IApiKey, IShop, IProduct };
