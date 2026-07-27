export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Class {
  id: string
  name: string
  level: string
}

export interface Student {
  id: string
  level: string
  userId: string
  classId: string
  user: User
  class: Class
  parents?: {
    parent: {
      user: { name: string; email: string }
    }
  }[]
}

export interface ChildItem {
  parentId: string
  studentId: string
  student: Student
}

export interface FeedbackEntry {
  id: string
  note: string
  date: string
  studentId: string
  teacherId: string
  teacher: {
    user: { name: string }
  }
  student: {
    user: { name: string }
  }
}

export interface MoodEntry {
  id: string
  mood: string
  date: string
  studentId: string
  teacherId: string
  teacher: {
    user: { name: string }
  }
  student: {
    user: { name: string }
  }
}

export interface GradeEntry {
  id: string
  subject: string
  score: number
  maxScore: number
  term: string
  studentId: string
  classId: string
  createdAt: string
  student: {
    user: { id: string; name: string; email: string }
  }
}

export interface AttendanceEntry {
  id: string
  date: string
  present: boolean
  studentId: string
  classId: string
  teacherId: string
  student: {
    user: { id: string; name: string; email: string }
  }
}

export interface TeacherJob {
  classId: string
  teacherId: string
  subject: string
  class: Class
  teacher: {
    user: { name: string; email: string }
  }
}

export type MoodType = 'focused' | 'tired' | 'anxious' | 'hyperactive' | 'happy'
