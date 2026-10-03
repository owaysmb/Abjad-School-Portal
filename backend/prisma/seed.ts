import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.mood.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.parentStudent.deleteMany()
  await prisma.classTeacher.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.user.deleteMany()
  await prisma.class.deleteMany()

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@abjad.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('Admin created')

  // Create class
  const class1 = await prisma.class.create({
    data: { name: '5A', level: 'Primary' }
  })
  console.log('Class created')

  // Create teacher
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacherUser = await prisma.user.create({
    data: {
      name: 'Mr Hassan',
      email: 'hassan@abjad.com',
      password: teacherPassword,
      role: 'TEACHER',
      teacher: { create: {} }
    },
    include: { teacher: true }
  })
  console.log('Teacher created')

  // Assign teacher to class
  await prisma.classTeacher.create({
    data: {
      teacherId: teacherUser.teacher!.id,
      classId: class1.id,
      subject: 'Mathematics'
    }
  })
  console.log('Teacher assigned to class')

  // Create student
  const studentPassword = await bcrypt.hash('student123', 10)
  const studentUser = await prisma.user.create({
    data: {
      name: 'Ahmed Ali',
      email: 'ahmed@abjad.com',
      password: studentPassword,
      role: 'STUDENT',
      student: {
        create: {
          level: 'Primary',
          classId: class1.id
        }
      }
    },
    include: { student: true }
  })
  console.log('Student created')

  // Create parent
  const parentPassword = await bcrypt.hash('parent123', 10)
  const parentUser = await prisma.user.create({
    data: {
      name: 'Sami Ali',
      email: 'sami@abjad.com',
      password: parentPassword,
      role: 'PARENT',
      parent: { create: {} }
    },
    include: { parent: true }
  })
  console.log('Parent created')

  // Assign child to parent
  await prisma.parentStudent.create({
    data: {
      parentId: parentUser.parent!.id,
      studentId: studentUser.student!.id
    }
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })