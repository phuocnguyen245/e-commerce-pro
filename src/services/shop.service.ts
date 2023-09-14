import Shops from "../models/shop.model.ts";

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    roles: 1,
  },
}: any) => {
  return await Shops.findOne({ email }).select(select).lean();
};

export { findByEmail };
