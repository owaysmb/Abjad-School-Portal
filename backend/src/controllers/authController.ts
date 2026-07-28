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
    
        const user = await prisma.user.findFirst({
            where:{
                email:email,
            }
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = generateToken(user.id, user.role)

        res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
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
    secure: false,
    sameSite: "lax" 
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