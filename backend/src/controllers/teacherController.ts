import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();


export const createTeacher = async (req:Request,res:Response) =>{

    try {
        const {name,email,password}  = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:"TEACHER",
                teacher: {
                    create: {}
                }
            },
            include: {
                teacher: true
            }
        })

        const { password: _, ...userWithoutPassword } = user
        res.status(201).json(userWithoutPassword)

    } catch (err) {
        res.status(500).json({message:"Error Creating Teacher"})
    }
}

export const getAllTeachers = async (req:Request,res:Response) =>{
    try {

        const teachers = await prisma.teacher.findMany({
            include:{
                user:{
                    select:{
                        name:true,
                        id:true,
                        email:true,
                        role:true,
                        createdAt:true,
                        
                    }
                }
            }
        })
        res.json(teachers);
        
    } catch (err) {
        res.status(500).json({message:"Error Getting All Teachers"})
    }
}




