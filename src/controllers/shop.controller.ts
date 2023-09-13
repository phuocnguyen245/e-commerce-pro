import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service.ts";

class AuthController {
  signUP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.signUP(req);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}
export default new AuthController();
