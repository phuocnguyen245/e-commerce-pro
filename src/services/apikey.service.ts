import ApiKeys from "../models/apiKey.model.ts";

const findById = async (key: string) => {
  const objectKeys = await ApiKeys.findOne({ key: key }).lean();
  return objectKeys;
};

export { findById };
