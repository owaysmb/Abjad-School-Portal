
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './src/context/AuthContext'
import { AdminPage} from "./src/pages/admin/AdminPage"
import {ParentPage} from "./src/pages/parent/ParentPage"
import {TeacherPage} from "./src/pages/teacher/TeacherPage"
import {StudentPage} from "./src/pages/student/StudentPage"
import { Navigate } from 'react-router-dom'
import {LoginPage} from "./src/pages/Login"

function App() {
  return (
    <>
      
    <AuthProvider>

      <BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/teacher" element={<TeacherPage />} />
    <Route path="/student" element={<StudentPage />} />
    <Route path="/parent" element={<ParentPage />} />
  </Routes>
</BrowserRouter>

    </AuthProvider>


    </>
  )
}

export default App
