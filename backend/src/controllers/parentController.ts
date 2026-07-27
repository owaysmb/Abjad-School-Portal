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
        console.log(err);
    }
}

export const getAllParents = async (req:Request,res:Response) =>{
    try {
        
        const parents = await prisma.parent.findMany({
            include: {
                user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
                children: {
                    include: {
                        student: {
                            include: {
                                user: { select: { name: true } }
                            }
                        }
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

export const getMyChildren = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' })
            return
        }

        const parent = await prisma.parent.findUnique({
            where: { userId: req.user.id }
        })

        if (!parent) {
            res.status(404).json({ message: 'Parent not found' })
            return
        }

        const children = await prisma.parentStudent.findMany({
            where: { parentId: parent.id },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        class: true
                    }
                }
            }
        })

        res.json(children)
    } catch (err) {
        res.status(500).json({ message: "Error getting children" })
    }
}