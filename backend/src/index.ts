import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import classRoutes from './routes/classRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/classes',classRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Abjad School Portal API running' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

