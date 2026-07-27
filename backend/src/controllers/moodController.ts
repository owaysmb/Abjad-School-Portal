import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();




export const addMood = async (req:AuthRequest,res:Response) =>{
    try {
        
        const {studentId,mood} = req.body;

        const teacher = await prisma.teacher.findUnique({
            where: { userId: req.user?.id }
        })

        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' })
            return
        }

        const AddMood = await prisma.mood.create({
            data:{
                studentId,
                mood,
                teacherId:teacher.id
            }
        })
        res.status(201).json(AddMood);

    } catch (err) {
        res.status(500).json({message:"Error Adding a Mood"})
    }
}


export const getStudentMood = async (req:Request,res:Response) =>{
    try {
        
        const studentId = req.params.studentId as string     

        if(!studentId){
            res.status(401).json({message:"Error StudentId"});
        }

        const studentMood = await prisma.mood.findMany({
            where:{studentId:studentId},
            include:{
                teacher:{
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
        res.status(200).json(studentMood);
    } catch (err) {
        res.status(500).json({message:"Error Getting Student mood"})
        console.log(err)
    }
}


export const getMyChildMood = async (req:AuthRequest,res:Response) =>{
    try {
        
        const parent = await prisma.parent.findUnique({
            where: { userId: req.user?.id }
        })

        if (!parent) {
            res.status(404).json({ message: 'Parent not found' })
            return
        }

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

        const getChildMood = await prisma.mood.findMany({
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
        res.json(getChildMood);

    } catch (err) {
        res.status(500).json({message:"Error Getting child's parent Mood"})
        console.log(err);
    }
}