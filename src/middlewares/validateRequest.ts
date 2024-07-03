import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export async function validateReq(req: Request, res: Response, next: NextFunction) {
    if (!await validationResult(req).isEmpty()) return res.status(401).json({ message: validationResult(req) })
    next();
}

