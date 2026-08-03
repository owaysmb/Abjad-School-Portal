import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import type { GradeEntry, AttendanceEntry } from '../../types'
import './StudentPage.css'
import { useAuth } from '../../context/AuthContext'

type Section = 'grades' | 'attendance'

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: 'grades', label: 'My Grades', icon: '📊' },
  { key: 'attendance', label: 'My Attendance', icon: '📋' },
]

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  grades: { title: 'My Grades', subtitle: 'Your academic performance' },
  attendance: { title: 'My Attendance', subtitle: 'Your attendance records' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getScoreClass(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100
  if (pct >= 85) return 'score-excellent'
  if (pct >= 70) return 'score-good'
  if (pct >= 50) return 'score-average'
  return 'score-poor'
}

export function StudentPage() {
  const [activeSection, setActiveSection] = useState<Section>('grades')
  const navigate = useNavigate()

  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (activeSection === 'grades') {
          const { data } = await api.get('/grade/mygrade')
          setGrades(data)
        } else {
          const { data } = await api.get('/attendance/me')
          setAttendance(data)
        }
      } catch {
        console.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeSection])


  const auth = useAuth();
  
  const handleLogout = async () => {
    await auth?.logout()
    navigate('/login')
  }
  

  const renderContent = () => {
    if (loading) {
      return <div className="student-loading">Loading...</div>
    }

    switch (activeSection) {
      case 'grades':
        return (
          <div className="student-data-card">
            {grades.length === 0 ? (
              <div className="student-empty">No grades available yet.</div>
            ) : (
              <table className="student-data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Max Score</th>
                    <th>Percentage</th>
                    <th>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => {
                    const pct = Math.round((g.score / g.maxScore) * 100)
                    return (
                      <tr key={g.id}>
                        <td>{g.subject}</td>
                        <td>{g.score}</td>
                        <td>{g.maxScore}</td>
                        <td>
                          <span className={`score-badge ${getScoreClass(g.score, g.maxScore)}`}>
                            {pct}%
                          </span>
                        </td>
                        <td>{g.term}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )

      case 'attendance':
        return (
          <div className="student-data-card">
            {attendance.length === 0 ? (
              <div className="student-empty">No attendance records available.</div>
            ) : (
              <table className="student-data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDate(a.date)}</td>
                      <td>
                        <span className={`attendance-badge ${a.present ? 'attendance-present' : 'attendance-absent'}`}>
                          {a.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
    }
  }

  const { title, subtitle } = sectionTitles[activeSection]

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="student-sidebar-header">
          <div className="student-sidebar-logo">
            <div className="student-sidebar-logo-icon">A</div>
            <span className="student-sidebar-logo-text">Abjad School</span>
          </div>
        </div>

        <nav className="student-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`student-sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="student-sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="student-sidebar-footer">
          <button className="student-sidebar-logout"  onClick={handleLogout}>
            <span className="student-sidebar-item-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="student-content">
        <div className="student-content-header">
          <div>
            <h1 className="student-content-title">{title}</h1>
            <p className="student-content-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="student-content-body">{renderContent()}</div>
      </main>
    </div>
  )
}
