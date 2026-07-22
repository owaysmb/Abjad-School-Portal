import { Request , Response , NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request{
    user?: {
        id:string,
        role:string
    }
}

export const protect = (req: AuthRequest ,res:Response ,next : NextFunction) =>{
    const token = req.cookies?.token;

    if(!token){
        res.status(401).json({message:'Not authroized '})
        return;
    }

    try {
        const decoded = verifyToken(token) as {id:string, role:string}
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({message : 'Invalid Token'})
    }
}

export const authorize = (...roles:string[])=>{
    return (req:AuthRequest,res : Response, next : NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403).json({message:'Access denied'})
            return
        }
        next()
    }
}
