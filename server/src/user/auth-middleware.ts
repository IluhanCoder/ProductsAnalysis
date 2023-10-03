import { NextFunction, Request, Response } from 'express';

export default async function authMiddleware(req: Request, res:Response, next: NextFunction) {
    if(!req.cookies.token) return res.status(401).send({message: "user is not authorised"});
    else next();
}