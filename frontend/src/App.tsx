import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminPage } from "./pages/admin/AdminPage"
import { ParentPage } from "./pages/parent/ParentPage"
import { TeacherPage } from "./pages/teacher/TeacherPage"
import { StudentPage } from "./pages/student/StudentPage"
import { LoginPage } from "./pages/Login"
import ProtectedRoute from './components/ProtectedRoutes'


function App() {
  const auth = useAuth()
  const user = auth?.user
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <LoginPage />
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/teacher" element={
            <ProtectedRoute role="TEACHER">
              <TeacherPage />
            </ProtectedRoute>
          } />
          <Route path="/student" element={
            <ProtectedRoute role="STUDENT">
              <StudentPage />
            </ProtectedRoute>
          } />
          <Route path="/parent" element={
            <ProtectedRoute role="PARENT">
              <ParentPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App