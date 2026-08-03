import { useEffect, useState } from 'react'
import api from '../../api/axios'

type ActivityTab = 'feedback' | 'mood' | 'grades' | 'attendance'

interface AdminFeedback {
  id: string
  note: string
  date: string
  teacher: { user: { name: string } } | null
  student: { user: { name: string } }
}

interface AdminMood {
  id: string
  mood: string
  date: string
  teacher: { user: { name: string } } | null
  student: { user: { name: string } }
}

interface AdminGrade {
  id: string
  subject: string
  score: number
  maxScore: number
  term: string
  teacher: { user: { name: string } } | null
  student: { user: { name: string } }
}

interface AdminAttendance {
  id: string
  date: string
  present: boolean
  teacher: { user: { name: string } } | null
  student: { user: { name: string } }
}

const activityTabs: { key: ActivityTab; label: string }[] = [
  { key: 'feedback', label: 'Feedback' },
  { key: 'mood', label: 'Mood' },
  { key: 'grades', label: 'Grades' },
  { key: 'attendance', label: 'Attendance' },
]

const subjectLabels: Record<string, string> = {
  math: 'Mathematics',
  english: 'English',
  science: 'Science',
  history: 'History',
  arabic: 'Arabic',
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

export function ActivityLog() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('feedback')
  const [feedback, setFeedback] = useState<AdminFeedback[]>([])
  const [mood, setMood] = useState<AdminMood[]>([])
  const [grades, setGrades] = useState<AdminGrade[]>([])
  const [attendance, setAttendance] = useState<AdminAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [feedbackRes, moodRes, gradesRes, attendanceRes] = await Promise.all([
          api.get<AdminFeedback[]>('/feedback/all'),
          api.get<AdminMood[]>('/mood/all'),
          api.get<AdminGrade[]>('/grade/all'),
          api.get<AdminAttendance[]>('/attendance/all'),
        ])
        setFeedback(feedbackRes.data)
        setMood(moodRes.data)
        setGrades(gradesRes.data)
        setAttendance(attendanceRes.data)
      } catch {
        setError('Failed to load activity data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const teacherName = (t: { user: { name: string } } | null) => t?.user?.name ?? '—'

  const renderContent = () => {
    if (loading) {
      return (
        <div className="table-card">
          <div className="table-empty">Loading...</div>
        </div>
      )
    }

    switch (activeTab) {
      case 'feedback':
        return (
          <div className="table-card">
            {feedback.length === 0 ? (
              <div className="table-empty">No feedback records found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Teacher Name</th>
                    <th>Note</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <tr key={f.id}>
                      <td>{f.student.user.name}</td>
                      <td>{teacherName(f.teacher)}</td>
                      <td>{f.note}</td>
                      <td>{formatDateTime(f.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )

      case 'mood':
        return (
          <div className="table-card">
            {mood.length === 0 ? (
              <div className="table-empty">No mood records found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Teacher Name</th>
                    <th>Mood</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mood.map((m) => (
                    <tr key={m.id}>
                      <td>{m.student.user.name}</td>
                      <td>{teacherName(m.teacher)}</td>
                      <td>
                        <span className={`activity-log-mood-badge ${m.mood}`}>{m.mood}</span>
                      </td>
                      <td>{formatDateTime(m.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )

      case 'grades':
        return (
          <div className="table-card">
            {grades.length === 0 ? (
              <div className="table-empty">No grade records found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Teacher Name</th>
                    <th>Subject</th>
                    <th>Score / Max</th>
                    <th>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id}>
                      <td>{g.student.user.name}</td>
                      <td>{teacherName(g.teacher)}</td>
                      <td>{subjectLabels[g.subject] ?? g.subject}</td>
                      <td>
                        <span className={`activity-log-score activity-log-score-${g.score / g.maxScore >= 0.7 ? 'high' : g.score / g.maxScore >= 0.5 ? 'medium' : 'low'}`}>
                          {g.score} / {g.maxScore}
                        </span>
                      </td>
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
          <div className="table-card">
            {attendance.length === 0 ? (
              <div className="table-empty">No attendance records found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Teacher Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td>{a.student.user.name}</td>
                      <td>{teacherName(a.teacher)}</td>
                      <td>{formatDate(a.date)}</td>
                      <td>
                        <span className={`status-badge ${a.present ? 'active' : 'inactive'}`}>
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

  return (
    <div>
      <div className="activity-log-tabs">
        {activityTabs.map((tab) => (
          <button
            key={tab.key}
            className={`activity-log-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {error && <div className="form-message error">{error}</div>}
      {renderContent()}
    </div>
  )
}
