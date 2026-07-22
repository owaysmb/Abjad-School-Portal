import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();


export const createClass = async (req:AuthRequest,res:Response) =>{
    try {

        const {name , level} = req.body;

        const newClass = await prisma.class.create({
            data:{
                name,
                level
            }
        })

        res.json(newClass);

    } catch (err) {
        res.status(500).json("ERROR Creating a Class")
    }
    

}

export const getAllClasses = async (req: AuthRequest, res: Response) => {

    try {
        
        const getClass = await prisma.class.findMany({
            include: {
                students: true,
                teachers: true
        }
        })
        res.json(getClass)

    } catch (err) {
        res.status(500).json("ERROR Creating a Class")
    }

}