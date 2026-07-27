import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import classRoutes from './routes/classRoutes'
import studentRoutes from "./routes/studentRoutes"
import teacherRoutes from "./routes/teacherRoutes"
import parentRoutes from "./routes/parentRoutes"
import attedanceRoutes from "./routes/attendanceRoutes"
import gradeRoutes from "./routes/gradeRoutes"
import feedbackRoutes from "./routes/feedbackRoutes"
import moodRoutes from "./routes/moodRoutes"

import cors from 'cors'

dotenv.config()



const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/classes',classRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/teacher",teacherRoutes);
app.use("/api/parent",parentRoutes);
app.use("/api/attendance",attedanceRoutes);
app.use("/api/grade",gradeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mood",moodRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Abjad School Portal API running' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

