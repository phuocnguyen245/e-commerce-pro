import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    fn(req, res, next).catch(next);
  };
};
