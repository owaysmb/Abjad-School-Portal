import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();


export const addGrade = async (req:AuthRequest,res:Response) =>{
    try {
        
        const {studentId, classId, subject , score, maxScore,term} = req.body;

        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' })
            return
        }
        
        const teacher = await prisma.teacher.findUnique({
                where: { userId: req.user.id }
        })

        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' })
            return
        }

        
        const grades = await prisma.grade.create({
            data:{
                studentId,
                classId,
                subject,
                score,
                maxScore,
                term,
                teacherId: teacher.id
            }
        })

        res.json(grades)

    } catch (err) {
        res.status(500).json({message:"Error Adding grades"})
    }
}



export const getGradesByClass = async (req:Request,res:Response) =>{
    try {
        
        const classId = req.params.classId as string

        const grades = await prisma.grade.findMany({
            where:{classId:classId},
            include: {
                student: {
                    include: {
                    user: {
                        select: {
                        id: true,
                        name: true,
                        email: true,
                        }
                    }
                    }
                }
            }
        })

        res.json(grades);

    } catch (err) {
        res.status(500).json({message:"Error Getting Grades"})
    }
} 


export const getMyGrades = async (req:AuthRequest,res:Response) =>{
    try {

        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' })
            return
        }
        
        const student = await prisma.student.findUnique({
            where:{userId : req.user.id}
        })

        if(!student){
            res.status(401).json({ message: 'Not authorized' })
            return
        }
        
        const myGrades = await prisma.grade.findMany({
            where: {studentId: student.id},
            include: {
                student: {
                    include: {
                    user: {
                        select: {
                        id: true,
                        name: true,
                        email: true,
                        }
                    }
                    }
                }
            }
        })
        res.json(myGrades)

    } catch (err) {
        res.status(500).json({message:"Error Getting Grades"})       
    }
}


export const getMyChildrenGrades = async (req: AuthRequest, res: Response) => {
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

        const studentParents = await prisma.parentStudent.findMany({
            where: { parentId: parent.id },
            select: { studentId: true }
        })

        const studentIds = studentParents.map(sp => sp.studentId)

        const grades = await prisma.grade.findMany({
            where: { studentId: { in: studentIds } },
            include: {
                student: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json(grades)
    } catch (err) {
        res.status(500).json({ message: "Error getting children's grades" })
    }
}


export const getAllGrades = async (req: Request, res: Response) => {
    try {
        const grades = await prisma.grade.findMany({
            include: {
                teacher: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                student: {
                    include: {
                        user: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(grades)
    } catch (err) {
        res.status(500).json({ message: "Error getting all grades" })
    }
}

export const updateGrade = async (req:AuthRequest,res:Response) =>{
    try {
        
        const id = req.params?.id as string
        const {score,maxScore,subject,term} = req.body;

        const grade = await prisma.grade.update({
            where:{id},
            data:{score,maxScore,subject,term}
        })

        res.json(grade)


    } catch (err) {
        res.status(500).json({message:"Error Updating Grades"})
        console.log(err);
    }
}