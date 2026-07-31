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
        console.log(err);
    }
}

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        classes: {
          include: {
            class: true
          }
        }
      }
    })
    res.json(teachers)
  } catch (err) {
    res.status(500).json({ message: 'Error getting teachers' })
  }
}

export const assignTeacherToClass = async (req: Request, res: Response) => {
  try {
    const { teacherId, classId, subject } = req.body

    const assignment = await prisma.classTeacher.create({
      data: {
        teacherId,
        classId,
        subject
      }
    })

    res.json(assignment)
  } catch (err) {
    res.status(500).json({ message: 'Error assigning teacher to class' })
    console.log(err);
  }
}

export const getTeacherjob = async (req:AuthRequest,res:Response)=>{
    try {
        const id = req.user?.id;

        const teacher = await prisma.teacher.findUnique({ where: { userId: id } })
        
        if(!teacher) {
          res.status(400).json({message:"teacher Not Found"})
        }

        const assigned = await prisma.classTeacher.findMany({
          where:{teacherId:teacher?.id},
              include: {
                    class: true,
                    teacher: {
                    include: {
                        user: {
                        select: {
                            name: true,
                            email: true
                        }
                        }
                    }
                    }
                }
        })
        res.json(assigned)
    } catch (err) {
        res.status(500).json({message:"Error Getting Subject and Classes"})
        console.log(err);        
    }
}

export const deleteTeacher = async (req:Request,res:Response)=>{
  try {
    
    const id = req.params.id as string;

    const teacher = await prisma.teacher.findUnique({where:{id}})

    if(!teacher) {
      res.status(400).json({message:"teacher Not Found"})
    }

    await prisma.user.delete({ where: { id: teacher?.userId } })
    res.json({ message: 'Student deleted successfully' })

  } catch (err) {
    res.status(500).json({message:"Error Deleting Teacher"})
  }
}