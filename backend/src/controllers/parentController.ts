import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();


export const createParent = async (req:Request,res:Response) =>{
    try {

        const {email,name,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data:{
                email,
                name,
                password:hashedPassword,
                role:"PARENT",
                parent:{
                    create:{}
                }
            },
            include: {
                parent: true
            }
        })

        const { password: _, ...userWithoutPassword } = user
        res.status(201).json(userWithoutPassword)
        
    } catch (err) {
        res.status(500).json({message:"Error creating parent"})
    }
}

export const getAllParents = async (req:Request,res:Response) =>{
    try {
        
        const parents = await prisma.parent.findMany({
            include: {
                user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
                }
            }
        })

        res.json(parents);

    } catch (err) {
        res.status(500).json({message:"Error Getting All Parents"})
    }
}


export const assignChildToParent = async (req:Request,res:Response) =>{
    try {
        const {parentId,studentId} = req.body;

        const assignChild = await prisma.parentStudent.create({
            data: {
                parentId,
                studentId
            }
        })

        res.json(assignChild);


    } catch (err) {
        res.status(500).json({message:"Error Assigning child to jus parent"})
    }
}