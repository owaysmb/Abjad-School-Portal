import jwt from "jsonwebtoken"

const jwt_SECRET = process.env.JWT_SECRET as string ;

export const generateToken = (id:string , role : string) : string =>{
    return jwt.sign({id,role} , jwt_SECRET, {expiresIn:'7d'})
}


export const verifyToken = (token:string) =>{
    return jwt.verify(token,jwt_SECRET)
}

