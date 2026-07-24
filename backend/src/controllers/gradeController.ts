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
        
        const grades = await prisma.grade.create({
            data:{
                studentId,
                classId,
                subject,
                score,
                maxScore,
                term,
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