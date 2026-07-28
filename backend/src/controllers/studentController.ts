import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();


export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, level, classId } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'STUDENT',
        name,
        student: {
          create: {
            level,
            classId
          }
        }
      },
      include: {
        student: true
      }
    })

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json(userWithoutPassword)

  } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error creating student', error: err })
  }
}


export const getAllStudents = async (req:Request,res:Response) =>{

    try {
        
        const students = await prisma.student.findMany({
          include: {
            class: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
              }
            },
            parents: {
              include: {
                parent: {
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
            }
          }
      })

        res.json(students);

    } catch (err) {
        res.status(500).json({messgae:"Error Getting Students"});
    }

}

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) {
      res.status(404).json({ message: 'Student not found' })
      return
    }
    await prisma.user.delete({ where: { id: student.userId } })
    res.json({ message: 'Student deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student' })
  }
}