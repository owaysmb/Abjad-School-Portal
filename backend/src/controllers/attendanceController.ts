import { Request,Response } from "express";
import { AuthRequest } from '../middleware/auth'
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();




export const markAttendance = async (req:AuthRequest,res:Response) =>{

    try {

        const {date,studentId,classId,present} = req.body;

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

        const attendance = await prisma.attendance.create({
            data:{
                date: new Date(date),
                studentId,
                classId,
                present,
                teacherId: teacher.id
            }
        })
    
        res.json(attendance);
        
    } catch (err) {
        res.status(500).json({message:"Error creating attendance"})
    }
}



export const getAttendanceByClass = async (req:Request,res:Response) =>{
    try {
        
        const classId = req.params.classId as string

        const attendance = await prisma.attendance.findMany({
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
        res.json(attendance)
    } catch (err) {
        res.status(500).json({message:"Error getting Attendance"})
    }
}

export const getMyAttendance = async (req:AuthRequest,res:Response) =>{
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

        const myAttendance = await prisma.attendance.findMany({
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

        res.json(myAttendance);

    } catch (err) {
        res.status(500).json({message:"Error Getting Attendance"})
    }
}


export const getMyChildrenAttendance = async (req: AuthRequest, res: Response) => {
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

        const attendance = await prisma.attendance.findMany({
            where: { studentId: { in: studentIds } },
            include: {
                student: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            },
            orderBy: { date: 'desc' }
        })

        res.json(attendance)
    } catch (err) {
        res.status(500).json({ message: "Error getting children's attendance" })
    }
}

export const getAllAttendance = async (req: Request, res: Response) => {
    try {
        const attendance = await prisma.attendance.findMany({
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
        res.json(attendance)
    } catch (err) {
        res.status(500).json({ message: "Error getting all attendance" })
    }
}

export const updateAttendance = async (req:AuthRequest,res:Response) =>{
    try {

        const id = req.params?.id as string;
        const {present} = req.body;

        const attendance = await prisma.attendance.update({
            where:{id},
            data:{present}
        })
        res.json(attendance);

    } catch (err) {
        res.status(500).json({message:"Error Updating Atterndance"})
        console.log(err);
    }
}