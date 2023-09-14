import { Request, Response } from "express";
import { CREATED, OK } from "../core/success.response.ts";
import AuthService from "../services/auth.service.ts";
import { findByEmail } from "../services/shop.service.ts";
import {
  BadRequestError,
  ConflictRequestError,
  NotFoundRequestError,
} from "../core/error.response.ts";
import bcrypt from "bcrypt";
class AuthController {
  static signUP = async (req: Request, res: Response) => {
    const result = await AuthService.signUP(req);
    return new CREATED({ data: result, message: "Register OK!" }).send(res);
  };
  static signIn = async (req: Request, res: Response) => {
    const result = await AuthService.signIn(req);
    return new OK({ data: result, message: "Login OK!" }).send(res);
  };
}
export default AuthController;
