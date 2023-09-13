import JWT from "jsonwebtoken";
export const createTokenPair = async (
  payload: any,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = await JWT.sign(payload, String(publicKey), {
      expiresIn: "2d",
    });

    const refreshToken = await JWT.sign(payload, String(privateKey), {
      expiresIn: "2d",
    });

    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) throw err;
      return decode;
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
