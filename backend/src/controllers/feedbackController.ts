import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();




export const addFeedback = async (req:AuthRequest,res:Response)=>{
    try {

        const {studentId, note} = req.body;

        const teacher = await prisma.teacher.findUnique({
            where: { userId: req.user?.id }
        })

        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' })
            return
        }

        const feedback = await prisma.feedback.create({
            data:{
                studentId,
                note,
                teacherId: teacher.id
            }
        })

        res.status(201).json(feedback)

    } catch (err) {
        res.status(500).json({message:"Error creating feedback"})
        console.log(err);
    }
    
}


export const getStudentFeedback = async (req:Request,res:Response) =>{
    try {

        const studentId = req.params.studentId as string     

        if(!studentId){
            res.status(401).json({message:"Error StudentId"});
        }

        const getFeedback = await prisma.feedback.findMany({
            where: { studentId: studentId },
            include: {
                teacher: {
                include: {
                    user: {
                    select: {
                        name: true
                    }
                    }
                }
                }
            },
            orderBy: {
                date: 'desc'
            }
})
        res.json(getFeedback);
        
    } catch (err) {
        res.status(500).json({message:"error getting feedback"})
    }
}

export const getMyChildFeedback = async (req:AuthRequest,res:Response)=>{
    try {
        
        const parent = await prisma.parent.findUnique({
            where: { userId: req.user?.id }
        })

        const studentParent = await prisma.parentStudent.findMany({
            where:{parentId:parent?.id},
            include:{
                student:{
                    include:{
                        user:{
                            select:{
                                name:true,
                            }
                        }
                    }
                }
            }
        })  

        const studentIds = studentParent.map(ps => ps.studentId);

        const getChildFeedback = await prisma.feedback.findMany({
            where: {
                studentId: { in: studentIds }
            },
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
            orderBy: { date: 'desc' }
        })
        res.json(getChildFeedback);
        
    } catch (err) {
        res.status(500).json({message:"Error Getting Feedback"})
    }
}