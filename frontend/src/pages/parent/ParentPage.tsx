import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import type { ChildItem, FeedbackEntry, MoodEntry, GradeEntry, AttendanceEntry } from '../../types'
import './ParentPage.css'
import { useAuth } from '../../context/AuthContext'

type Section = 'children' | 'feedback' | 'mood' | 'grades' | 'attendance'

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: 'children', label: 'My Children', icon: '👶' },
  { key: 'feedback', label: 'Feedback Feed', icon: '📝' },
  { key: 'mood', label: 'Mood History', icon: '🎭' },
  { key: 'grades', label: 'Grades', icon: '📊' },
  { key: 'attendance', label: 'Attendance', icon: '📋' },
]

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  children: { title: 'My Children', subtitle: 'View information about your children' },
  feedback: { title: 'Feedback Feed', subtitle: 'Teacher notes about your children' },
  mood: { title: 'Mood History', subtitle: 'Daily mood tracking for your children' },
  grades: { title: 'Grades', subtitle: 'Academic performance of your children' },
  attendance: { title: 'Attendance', subtitle: 'Attendance records for your children' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ParentPage() {
  const [activeSection, setActiveSection] = useState<Section>('children')
  const navigate = useNavigate()

  const [children, setChildren] = useState<ChildItem[]>([])
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])

  const [loading, setLoading] = useState<Record<Section, boolean>>({
    children: false,
    feedback: false,
    mood: false,
    grades: false,
    attendance: false,
  })

  const auth = useAuth();

  const handleLogout = async () => {
    await auth?.logout()
    navigate('/login')
  }


  useEffect(() => {
    const fetchChildren = async () => {
      setLoading((prev) => ({ ...prev, children: true }))
      try {
        const { data } = await api.get('/parent/mychildren')
        setChildren(data)
      } catch {
        console.error('Failed to fetch children')
      } finally {
        setLoading((prev) => ({ ...prev, children: false }))
      }
    }
    fetchChildren()
  }, [])

  useEffect(() => {
    if (activeSection === 'feedback') {
      const fetchFeedback = async () => {
        setLoading((prev) => ({ ...prev, feedback: true }))
        try {
          const { data } = await api.get('/feedback/mychild')
          setFeedback(data)
        } catch {
          console.error('Failed to fetch feedback')
        } finally {
          setLoading((prev) => ({ ...prev, feedback: false }))
        }
      }
      fetchFeedback()
    }
  }, [activeSection])


  useEffect(() => {
    if (activeSection === 'mood') {
      const fetchMoods = async () => {
        setLoading((prev) => ({ ...prev, mood: true }))
        try {
          const { data } = await api.get('/mood/mychild')
          setMoods(data)
        } catch {
          console.error('Failed to fetch moods')
        } finally {
          setLoading((prev) => ({ ...prev, mood: false }))
        }
      }
      fetchMoods()
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection === 'grades') {
      const fetchGrades = async () => {
        setLoading((prev) => ({ ...prev, grades: true }))
        try {
          const { data } = await api.get('/grade/mychildren')
          setGrades(data)
        } catch {
          console.error('Failed to fetch grades')
        } finally {
          setLoading((prev) => ({ ...prev, grades: false }))
        }
      }
      fetchGrades()
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection === 'attendance') {
      const fetchAttendance = async () => {
        setLoading((prev) => ({ ...prev, attendance: true }))
        try {
          const { data } = await api.get('/attendance/mychildren')
          setAttendance(data)
        } catch {
          console.error('Failed to fetch attendance')
        } finally {
          setLoading((prev) => ({ ...prev, attendance: false }))
        }
      }
      fetchAttendance()
    }
  }, [activeSection])

  const renderContent = () => {
    if (loading[activeSection]) {
      return <div className="parent-loading">Loading...</div>
    }

    switch (activeSection) {
      case 'children':
        return (
          <div className="children-grid">
            {children.length === 0 ? (
              <div className="parent-empty">No children found.</div>
            ) : (
              children.map((child) => (
                <div key={child.studentId} className="child-card">
                  <div className="child-card-name">{child.student.user.name}</div>
                  <div className="child-card-detail">
                    <strong>Class:</strong> {child.student.class.name}
                  </div>
                  <div className="child-card-detail">
                    <strong>Level:</strong> {child.student.level}
                  </div>
                  <div className="child-card-detail">
                    <strong>Email:</strong> {child.student.user.email}
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'feedback':
        return (
          <div className="feedback-feed">
            {feedback.length === 0 ? (
              <div className="parent-empty">No feedback available.</div>
            ) : (
              feedback.map((item) => (
                <div key={item.id} className="feedback-card">
                  <div className="feedback-card-header">
                    <span className="feedback-card-student">{item.student.user.name}</span>
                    <div className="feedback-card-meta">
                      <span>{item.teacher.user.name}</span>
                      <span>{formatDateTime(item.date)}</span>
                    </div>
                  </div>
                  <div className="feedback-card-note">{item.note}</div>
                </div>
              ))
            )}
          </div>
        )

      case 'mood':
        return (
          <div className="mood-timeline">
            {moods.length === 0 ? (
              <div className="parent-empty">No mood entries available.</div>
            ) : (
              moods.map((item) => (
                <div key={item.id} className="mood-entry">
                  <span className={`mood-badge ${item.mood}`}>{item.mood}</span>
                  <div className="mood-entry-info">
                    <div className="mood-entry-student">{item.student.user.name}</div>
                    <div className="mood-entry-meta">Recorded by {item.teacher.user.name}</div>
                  </div>
                  <span className="mood-entry-date">{formatDate(item.date)}</span>
                </div>
              ))
            )}
          </div>
        )

      case 'grades':
        return (
          <div className="data-card">
            {grades.length === 0 ? (
              <div className="parent-empty">No grades available.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Max Score</th>
                    <th>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id}>
                      <td>{g.student.user.name}</td>
                      <td>{g.subject}</td>
                      <td>{g.score}</td>
                      <td>{g.maxScore}</td>
                      <td>{g.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )

      case 'attendance':
        return (
          <div className="data-card">
            {attendance.length === 0 ? (
              <div className="parent-empty">No attendance records available.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td>{a.student.user.name}</td>
                      <td>{formatDate(a.date)}</td>
                      <td>
                        <span className={`badge ${a.present ? 'badge-present' : 'badge-absent'}`}>
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
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-sidebar-header">
          <div className="parent-sidebar-logo">
            <div className="parent-sidebar-logo-icon">A</div>
            <span className="parent-sidebar-logo-text">Abjad School</span>
          </div>
        </div>

        <nav className="parent-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`parent-sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="parent-sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="parent-sidebar-footer">
          <button className="parent-sidebar-logout" onClick={handleLogout}>
            <span className="parent-sidebar-item-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="parent-content">
        <div className="parent-content-header">
          <div>
            <h1 className="parent-content-title">{title}</h1>
            <p className="parent-content-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="parent-content-body">{renderContent()}</div>
      </main>
    </div>
  )
}
