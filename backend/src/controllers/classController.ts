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

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const classes = await prisma.student.findMany({ where: { classId: id } })
    if (classes.length > 0) {
      res.status(400).json({ message: 'Cannot delete class with classes assigned' })
      return
    }
    await prisma.class.delete({ where: { id } })
    res.json({ message: 'Class deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting class' })
    console.log(err);
  }
}