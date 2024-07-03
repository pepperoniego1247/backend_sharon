import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { currentUser } from "../interfaces/user";
import { Response, Request, NextFunction } from "express";
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: currentUser
        }
    }
}

export async function validationToken(req: Request, res: Response, next: NextFunction) {
    try { 
        if (!req.header("Authorization")) {
            console.log("PRIMERA CAPA");
            return res.status(401).send("credentials expired");
        } else {
            console.log(req.header("Authorization"))
            req.user = jwt.verify(req.header("Authorization")!, process.env.ACCESS_TOKEN_SECRET!) as currentUser;
            next();
        }
     } catch (error) { 
        console.log(error);
        return res.status(401).send({ message: "No authorizado" }); }
}