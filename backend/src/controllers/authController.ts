import { Request,Response } from "express";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import { generateToken } from "../utils/jwt";
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient();

export const signUp = async (req:Request, res:Response) =>{
    try {
        const {username , email,role,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data:{
                name:username,
                email:email,
                password:hashedPassword,
                role:role
            }
        })
        const { password: _, ...userWithoutPassword } = newUser
        res.status(201).json(userWithoutPassword)

    } catch (err) {
        res.status(500).json({message:"SignUp error"})
    }
    

}


export const login = async (req:Request,res:Response) =>{

    try {

        const {email,password} = req.body;
    
        let user = await prisma.user.findUnique({
            where:{
                email:email,
            }
        })

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const now = Date.now();

        if(user.lockUntil && user.lockUntil.getTime() > now ){
            return res.status(423).json({
                message:"account locked",
                lockUntil:user.lockUntil
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            const attempts = user.failedLoginAttempts + 1
            const locked = attempts >= 5

            await prisma.user.update({
                where: { id: user.id },
                data: {
                failedLoginAttempts: attempts,
                lockUntil: locked ? new Date(Date.now() + 15 * 60 * 1000) : null // lock 15 mins
                }
            })

            return res.status(401).json({
                error: locked ? 'Account locked for 15 minutes' : 'Invalid email or password'
            })

        }

        await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockUntil: null }
        })

        const token = generateToken(user.id, user.role)

        res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        sameSite: 'none',
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        })
        const { password: _, ...userWithoutPassword } = user
        res.status(200).json({ user: userWithoutPassword })

    } catch (err) {
        res.status(400).json({message:"Login Error"})
    }

    
}
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  })
  
  res.json({ message: 'Logged out successfully' })
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' })
      return
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Error getting user' })
  }
}

export const resetPassword = async (req:AuthRequest,res:Response) =>{
    try {
        const {userId  , newPassword} = req.body;

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        await prisma.user.update({
            where:{id:userId},
            data:{password:hashedPassword}
        })

        res.json({ message: 'Password reset successfully' })

    } catch (err) {
        res.status(500).json({message:"Error Reset Password"})
        console.log(err);
    }
}