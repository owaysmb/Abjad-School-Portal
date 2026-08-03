import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import type { TeacherJob, Student, MoodType, AttendanceEntry, GradeEntry, FeedbackEntry, MoodEntry } from '../../types'
import './TeacherPage.css'
import { useAuth } from '../../context/AuthContext'

type Section = 'classes' | 'attendance' | 'feedback' | 'mood' | 'grades' | 'activity'

type ActivityTab = 'attendance' | 'grades' | 'feedback' | 'mood'

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: 'classes', label: 'My Classes', icon: '📚' },
  { key: 'attendance', label: 'Mark Attendance', icon: '📋' },
  { key: 'feedback', label: 'Add Feedback', icon: '📝' },
  { key: 'mood', label: 'Add Mood', icon: '🎭' },
  { key: 'grades', label: 'Add Grade', icon: '📊' },
  { key: 'activity', label: 'My Activity', icon: '📈' },
]

const activityTabs: { key: ActivityTab; label: string }[] = [
  { key: 'attendance', label: 'My Attendance' },
  { key: 'grades', label: 'My Grades' },
  { key: 'feedback', label: 'My Feedback' },
  { key: 'mood', label: 'My Mood' },
]

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  classes: { title: 'My Classes', subtitle: 'Classes and subjects you teach' },
  attendance: { title: 'Mark Attendance', subtitle: 'Record student attendance' },
  feedback: { title: 'Add Feedback', subtitle: 'Write a note about a student' },
  mood: { title: 'Add Mood', subtitle: 'Record a student\'s mood' },
  grades: { title: 'Add Grade', subtitle: 'Enter a student\'s grade' },
  activity: { title: 'My Activity', subtitle: 'Attendance, grades, feedback and mood you have recorded' },
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

function getScoreColor(score: number, maxScore: number) {
  const ratio = score / maxScore
  if (ratio >= 0.7) return 'activity-score-high'
  if (ratio >= 0.5) return 'activity-score-medium'
  return 'activity-score-low'
}

const moodOptions: MoodType[] = ['focused', 'tired', 'anxious', 'hyperactive', 'happy']

const subjectLabels: Record<string, string> = {
  math: 'Mathematics',
  english: 'English',
  science: 'Science',
  history: 'History',
  arabic: 'Arabic',
}

export function TeacherPage() {
  const [activeSection, setActiveSection] = useState<Section>('classes')
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<TeacherJob[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const [activeActivityTab, setActiveActivityTab] = useState<ActivityTab>('attendance')
  const [myAttendance, setMyAttendance] = useState<AttendanceEntry[]>([])
  const [myGrades, setMyGrades] = useState<GradeEntry[]>([])
  const [myFeedback, setMyFeedback] = useState<FeedbackEntry[]>([])
  const [myMood, setMyMood] = useState<MoodEntry[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  const [editingGradeId, setEditingGradeId] = useState<string | null>(null)
  const [gradeEditForm, setGradeEditForm] = useState({ subject: '', score: '', maxScore: '', term: '' })
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null)
  const [attendanceEditPresent, setAttendanceEditPresent] = useState(true)
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null)
  const [feedbackEditNote, setFeedbackEditNote] = useState('')
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null)
  const [moodEditValue, setMoodEditValue] = useState<MoodType>('focused')
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [attForm, setAttForm] = useState({ studentId: '', classId: '', date: '', present: true })
  const [feedbackForm, setFeedbackForm] = useState({ studentId: '', note: '' })
  const [moodForm, setMoodForm] = useState({ studentId: '', mood: '' })
  const [gradeForm, setGradeForm] = useState({ studentId: '', classId: '', subject: '', score: '', maxScore: '', term: '' })

  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const auth = useAuth();

  const handleLogout = async () => {
    await auth?.logout()
    navigate('/login')
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, studentsRes] = await Promise.all([
          api.get('/teacher/job'),
          api.get('/student'),
        ])
        setJobs(jobsRes.data)
        setStudents(studentsRes.data)
      } catch {
        console.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    } 
    fetchData()
  }, [])

  useEffect(() => {
    const fetchActivity = async () => {
      setActivityLoading(true)
      try {
        const [attRes, gradesRes, feedbackRes, moodRes] = await Promise.all([
          api.get('/teacher/attendance'),
          api.get('/teacher/grades'),
          api.get('/teacher/feedback'),
          api.get('/teacher/mood'),
        ])
        setMyAttendance(attRes.data)
        setMyGrades(gradesRes.data)
        setMyFeedback(feedbackRes.data)
        setMyMood(moodRes.data)
      } catch {
        console.error('Failed to fetch activity data')
      } finally {
        setActivityLoading(false)
      }
    }
    fetchActivity()
  }, [])


  const clearFormState = () => {
    setSubmitting(false)
    setFormMessage(null)
  }

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage(null)
    try {
      await api.post('/attendance/mark-attendance', {
        studentId: attForm.studentId,
        classId: attForm.classId,
        date: attForm.date,
        present: attForm.present,
      })
      setFormMessage({ type: 'success', text: 'Attendance marked successfully.' })
      setAttForm({ studentId: '', classId: '', date: '', present: true })
    } catch {
      setFormMessage({ type: 'error', text: 'Failed to mark attendance.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage(null)
    try {
      await api.post('/feedback', {
        studentId: feedbackForm.studentId,
        note: feedbackForm.note,
      })
      setFormMessage({ type: 'success', text: 'Feedback added successfully.' })
      setFeedbackForm({ studentId: '', note: '' })
    } catch {
      setFormMessage({ type: 'error', text: 'Failed to add feedback.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage(null)
    try {
      await api.post('/mood', {
        studentId: moodForm.studentId,
        mood: moodForm.mood,
      })
      setFormMessage({ type: 'success', text: 'Mood entry added successfully.' })
      setMoodForm({ studentId: '', mood: '' })
    } catch {
      setFormMessage({ type: 'error', text: 'Failed to add mood entry.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const score = parseFloat(gradeForm.score)
    const maxScore = parseFloat(gradeForm.maxScore)

    if (isNaN(score) || score < 0 || score > 100) {
      setFormMessage({ type: 'error', text: 'Score must be between 0 and 100.' })
      return
    }
    if (isNaN(maxScore) || maxScore <= 0 || maxScore > 100) {
      setFormMessage({ type: 'error', text: 'Max Score must be between 0 and 100.' })
      return
    }

    setSubmitting(true)
    setFormMessage(null)
    try {
      await api.post('/grade', {
        studentId: gradeForm.studentId,
        classId: gradeForm.classId,
        subject: gradeForm.subject,
        score,
        maxScore,
        term: gradeForm.term,
      })
      setFormMessage({ type: 'success', text: 'Grade added successfully.' })
      setGradeForm({ studentId: '', classId: '', subject: '', score: '', maxScore: '', term: '' })
    } catch {
      setFormMessage({ type: 'error', text: 'Failed to add grade.' })
    } finally {
      setSubmitting(false)
    }
  }

  const refreshGrades = async () => {
    try {
      const { data } = await api.get('/teacher/grades')
      setMyGrades(data)
    } catch {
      console.error('Failed to refresh grades')
    }
  }

  const refreshAttendance = async () => {
    try {
      const { data } = await api.get('/teacher/attendance')
      setMyAttendance(data)
    } catch {
      console.error('Failed to refresh attendance')
    }
  }

  const startGradeEdit = (g: GradeEntry) => {
    setEditMessage(null)
    setEditingGradeId(g.id)
    setGradeEditForm({ subject: g.subject, score: String(g.score), maxScore: String(g.maxScore), term: g.term })
  }

  const handleGradeEditSave = async (id: string) => {
    const score = parseFloat(gradeEditForm.score)
    const maxScore = parseFloat(gradeEditForm.maxScore)

    if (isNaN(score) || score < 0 || score > 100) {
      setEditMessage({ type: 'error', text: 'Score must be between 0 and 100.' })
      return
    }
    if (isNaN(maxScore) || maxScore <= 0 || maxScore > 100) {
      setEditMessage({ type: 'error', text: 'Max Score must be between 0 and 100.' })
      return
    }
    if (!gradeEditForm.subject || !gradeEditForm.term.trim()) {
      setEditMessage({ type: 'error', text: 'Subject and Term are required.' })
      return
    }

    try {
      await api.put(`/grade/${id}`, {
        subject: gradeEditForm.subject,
        score,
        maxScore,
        term: gradeEditForm.term.trim(),
      })
      setEditMessage({ type: 'success', text: 'Grade updated successfully.' })
      setEditingGradeId(null)
      refreshGrades()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to update grade.' })
    }
  }

  const startAttendanceEdit = (a: AttendanceEntry) => {
    setEditMessage(null)
    setEditingAttendanceId(a.id)
    setAttendanceEditPresent(a.present)
  }

  const handleAttendanceEditSave = async (id: string) => {
    try {
      await api.put(`/attendance/${id}`, { present: attendanceEditPresent })
      setEditMessage({ type: 'success', text: 'Attendance updated successfully.' })
      setEditingAttendanceId(null)
      refreshAttendance()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to update attendance.' })
    }
  }

  const refreshFeedback = async () => {
    try {
      const { data } = await api.get('/teacher/feedback')
      setMyFeedback(data)
    } catch {
      console.error('Failed to refresh feedback')
    }
  }

  const refreshMood = async () => {
    try {
      const { data } = await api.get('/teacher/mood')
      setMyMood(data)
    } catch {
      console.error('Failed to refresh mood')
    }
  }

  const startFeedbackEdit = (f: FeedbackEntry) => {
    setEditMessage(null)
    setEditingFeedbackId(f.id)
    setFeedbackEditNote(f.note)
  }

  const handleFeedbackEditSave = async (id: string) => {
    if (!feedbackEditNote.trim()) {
      setEditMessage({ type: 'error', text: 'Feedback note is required.' })
      return
    }
    try {
      await api.put(`/feedback/${id}`, { note: feedbackEditNote.trim() })
      setEditMessage({ type: 'success', text: 'Feedback updated successfully.' })
      setEditingFeedbackId(null)
      refreshFeedback()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to update feedback.' })
    }
  }

  const handleFeedbackDelete = async (f: FeedbackEntry) => {
    try {
      await api.delete(`/feedback/${f.id}`)
      setEditMessage({ type: 'success', text: 'Feedback deleted successfully.' })
      setEditingFeedbackId(null)
      refreshFeedback()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to delete feedback.' })
    }
  }

  const startMoodEdit = (m: MoodEntry) => {
    setEditMessage(null)
    setEditingMoodId(m.id)
    setMoodEditValue(m.mood as MoodType)
  }

  const handleMoodEditSave = async (id: string) => {
    try {
      await api.put(`/mood/${id}`, { mood: moodEditValue })
      setEditMessage({ type: 'success', text: 'Mood updated successfully.' })
      setEditingMoodId(null)
      refreshMood()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to update mood.' })
    }
  }

  const handleMoodDelete = async (m: MoodEntry) => {
    try {
      await api.delete(`/mood/${m.id}`)
      setEditMessage({ type: 'success', text: 'Mood deleted successfully.' })
      setEditingMoodId(null)
      refreshMood()
    } catch {
      setEditMessage({ type: 'error', text: 'Failed to delete mood.' })
    }
  }

  const renderActivityContent = () => {
    switch (activeActivityTab) {
      case 'attendance': {
        const sorted = [...myAttendance].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        return (
          <div className="activity-card">
            {editMessage && (
              <div className={`form-message ${editMessage.type}`}>{editMessage.text}</div>
            )}
            {sorted.length === 0 ? (
              <div className="teacher-empty">No attendance records yet.</div>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((a) =>
                    editingAttendanceId === a.id ? (
                      <tr key={a.id}>
                        <td>{a.student.user.name}</td>
                        <td>{formatDate(a.date)}</td>
                        <td>
                          <div className="activity-attendance-edit">
                            <label className="toggle">
                              <input
                                type="checkbox"
                                checked={attendanceEditPresent}
                                onChange={(e) => setAttendanceEditPresent(e.target.checked)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <span className="toggle-label">
                              {attendanceEditPresent ? 'Present' : 'Absent'}
                            </span>
                          </div>
                        </td>
                        <td className="activity-actions-cell">
                          <button
                            className="activity-edit-btn save"
                            onClick={() => handleAttendanceEditSave(a.id)}
                          >
                            Save
                          </button>
                          <button
                            className="activity-edit-btn cancel"
                            onClick={() => { setEditingAttendanceId(null); setEditMessage(null) }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={a.id}>
                        <td>{a.student.user.name}</td>
                        <td>{formatDate(a.date)}</td>
                        <td>
                          <span className={`activity-badge ${a.present ? 'activity-present' : 'activity-absent'}`}>
                            {a.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="activity-actions-cell">
                          <button className="activity-edit-btn" onClick={() => startAttendanceEdit(a)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )
      }

      case 'grades':
        return (
          <div className="activity-card">
            {editMessage && (
              <div className={`form-message ${editMessage.type}`}>{editMessage.text}</div>
            )}
            {myGrades.length === 0 ? (
              <div className="teacher-empty">No grades recorded yet.</div>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Max Score</th>
                    <th>Term</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myGrades.map((g) =>
                    editingGradeId === g.id ? (
                      <tr key={g.id}>
                        <td>{g.student.user.name}</td>
                        <td>
                          <select
                            className="activity-edit-input"
                            value={gradeEditForm.subject}
                            onChange={(e) => setGradeEditForm({ ...gradeEditForm, subject: e.target.value })}
                          >
                            <option value="">Select subject</option>
                            {Object.entries(subjectLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            className="activity-edit-input activity-edit-small"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={gradeEditForm.score}
                            onChange={(e) => setGradeEditForm({ ...gradeEditForm, score: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="activity-edit-input activity-edit-small"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="100"
                            value={gradeEditForm.maxScore}
                            onChange={(e) => setGradeEditForm({ ...gradeEditForm, maxScore: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="activity-edit-input"
                            type="text"
                            value={gradeEditForm.term}
                            onChange={(e) => setGradeEditForm({ ...gradeEditForm, term: e.target.value })}
                          />
                        </td>
                        <td className="activity-actions-cell">
                          <button
                            className="activity-edit-btn save"
                            onClick={() => handleGradeEditSave(g.id)}
                          >
                            Save
                          </button>
                          <button
                            className="activity-edit-btn cancel"
                            onClick={() => { setEditingGradeId(null); setEditMessage(null) }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={g.id}>
                        <td>{g.student.user.name}</td>
                        <td>{subjectLabels[g.subject] ?? g.subject}</td>
                        <td className={getScoreColor(g.score, g.maxScore)}>{g.score}</td>
                        <td>{g.maxScore}</td>
                        <td>{g.term}</td>
                        <td className="activity-actions-cell">
                          <button className="activity-edit-btn" onClick={() => startGradeEdit(g)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )

      case 'feedback': {
        const sorted = [...myFeedback].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        return (
          <div className="activity-feedback-feed">
            {editMessage && (
              <div className={`form-message ${editMessage.type}`}>{editMessage.text}</div>
            )}
            {sorted.length === 0 ? (
              <div className="teacher-empty">No feedback written yet.</div>
            ) : (
              sorted.map((item) =>
                editingFeedbackId === item.id ? (
                  <div key={item.id} className="activity-feedback-card">
                    <div className="activity-feedback-card-header">
                      <span className="activity-feedback-student">{item.student.user.name}</span>
                      <span className="activity-feedback-date">{formatDateTime(item.date)}</span>
                    </div>
                    <textarea
                      className="activity-edit-input activity-feedback-edit"
                      value={feedbackEditNote}
                      onChange={(e) => setFeedbackEditNote(e.target.value)}
                    />
                    <div className="activity-edit-actions">
                      <button className="activity-edit-btn save" onClick={() => handleFeedbackEditSave(item.id)}>
                        Save
                      </button>
                      <button
                        className="activity-edit-btn cancel"
                        onClick={() => { setEditingFeedbackId(null); setEditMessage(null) }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="activity-feedback-card">
                    <div className="activity-feedback-card-header">
                      <span className="activity-feedback-student">{item.student.user.name}</span>
                      <span className="activity-feedback-date">{formatDateTime(item.date)}</span>
                    </div>
                    <div className="activity-feedback-note">{item.note}</div>
                    <div className="activity-edit-actions">
                      <button className="activity-edit-btn" onClick={() => startFeedbackEdit(item)}>
                        Edit
                      </button>
                      <button className="activity-edit-btn delete" onClick={() => handleFeedbackDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )
      }

      case 'mood':
        return (
          <div className="activity-mood-timeline">
            {editMessage && (
              <div className={`form-message ${editMessage.type}`}>{editMessage.text}</div>
            )}
            {myMood.length === 0 ? (
              <div className="teacher-empty">No mood entries recorded yet.</div>
            ) : (
              myMood.map((item) =>
                editingMoodId === item.id ? (
                  <div key={item.id} className="activity-mood-entry">
                    <div className="activity-mood-entry-info">
                      <div className="activity-mood-entry-student">{item.student.user.name}</div>
                    </div>
                    <select
                      className="activity-edit-input"
                      value={moodEditValue}
                      onChange={(e) => setMoodEditValue(e.target.value as MoodType)}
                    >
                      {moodOptions.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                    <span className="activity-mood-entry-date">{formatDate(item.date)}</span>
                    <div className="activity-edit-actions">
                      <button className="activity-edit-btn save" onClick={() => handleMoodEditSave(item.id)}>
                        Save
                      </button>
                      <button
                        className="activity-edit-btn cancel"
                        onClick={() => { setEditingMoodId(null); setEditMessage(null) }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="activity-mood-entry">
                    <span className={`activity-mood-badge ${item.mood}`}>{item.mood}</span>
                    <div className="activity-mood-entry-info">
                      <div className="activity-mood-entry-student">{item.student.user.name}</div>
                    </div>
                    <span className="activity-mood-entry-date">{formatDate(item.date)}</span>
                    <div className="activity-edit-actions">
                      <button className="activity-edit-btn" onClick={() => startMoodEdit(item)}>
                        Edit
                      </button>
                      <button className="activity-edit-btn delete" onClick={() => handleMoodDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div className="teacher-loading">Loading...</div>
    }

    switch (activeSection) {
      case 'classes':
        return (
          <div className="classes-list">
            {jobs.length === 0 ? (
              <div className="teacher-empty">No classes assigned yet.</div>
            ) : (
              jobs.map((job, idx) => (
                <div key={`${job.classId}-${job.teacherId}-${job.subject}-${idx}`} className="class-item">
                  <div className="class-item-icon">📖</div>
                  <div className="class-item-info">
                    <div className="class-item-name">{job.class.name}</div>
                    <div className="class-item-subject">Subject: {job.subject}</div>
                  </div>
                  <span className="class-item-level">{job.class.level}</span>
                </div>
              ))
            )}
          </div>
        )

      case 'attendance':
        return (
          <div className="form-card">
            <h3 className="form-title">Mark Attendance</h3>
            <form onSubmit={handleAttendanceSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={attForm.studentId}
                    onChange={(e) => setAttForm({ ...attForm, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select
                    className="form-select"
                    value={attForm.classId}
                    onChange={(e) => setAttForm({ ...attForm, classId: e.target.value })}
                    required
                  >
                    <option value="">Select class</option>
                    {jobs.map((job) => (
                      <option key={job.classId} value={job.classId}>
                        {job.class.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={attForm.date}
                    onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="toggle-wrapper">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={attForm.present}
                        onChange={(e) => setAttForm({ ...attForm, present: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">{attForm.present ? 'Present' : 'Absent'}</span>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Mark Attendance'}
                </button>
              </div>
              {formMessage && activeSection === 'attendance' && (
                <div className={`form-message ${formMessage.type}`}>{formMessage.text}</div>
              )}
            </form>
          </div>
        )

      case 'feedback':
        return (
          <div className="form-card">
            <h3 className="form-title">Add Feedback</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-grid single-col">
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={feedbackForm.studentId}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Note</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write your feedback about the student..."
                    value={feedbackForm.note}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, note: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Feedback'}
                </button>
              </div>
              {formMessage && activeSection === 'feedback' && (
                <div className={`form-message ${formMessage.type}`}>{formMessage.text}</div>
              )}
            </form>
          </div>
        )

      case 'mood':
        return (
          <div className="form-card">
            <h3 className="form-title">Add Mood Entry</h3>
            <form onSubmit={handleMoodSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={moodForm.studentId}
                    onChange={(e) => setMoodForm({ ...moodForm, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mood</label>
                  <select
                    className="form-select"
                    value={moodForm.mood}
                    onChange={(e) => setMoodForm({ ...moodForm, mood: e.target.value })}
                    required
                  >
                    <option value="">Select mood</option>
                    {moodOptions.map((m) => (
                      <option key={m} value={m}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Mood'}
                </button>
              </div>
              {formMessage && activeSection === 'mood' && (
                <div className={`form-message ${formMessage.type}`}>{formMessage.text}</div>
              )}
            </form>
          </div>
        )

      case 'grades':
        return (
          <div className="form-card">
            <h3 className="form-title">Add Grade</h3>
            <form onSubmit={handleGradeSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={gradeForm.studentId}
                    onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select
                    className="form-select"
                    value={gradeForm.classId}
                    onChange={(e) => setGradeForm({ ...gradeForm, classId: e.target.value })}
                    required
                  >
                    <option value="">Select class</option>
                    {jobs.map((job) => (
                      <option key={job.classId} value={job.classId}>
                        {job.class.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-select"
                      name="subject" 
                      onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })} 
                      value={gradeForm.subject}
                      required >
                      <option value="">Select subject</option>
                      <option value="math">Mathematics</option>
                      <option value="english">English</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="arabic">Arabic</option>
                  </select>
                </div>  

                <div className="form-group">
                  <label className="form-label">Term</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Fall 2026"
                    value={gradeForm.term}
                    onChange={(e) => setGradeForm({ ...gradeForm, term: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Score</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Score</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100"
                    placeholder="100"
                    value={gradeForm.maxScore}
                    onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Grade'}
                </button>
              </div>
              {formMessage && activeSection === 'grades' && (
                <div className={`form-message ${formMessage.type}`}>{formMessage.text}</div>
              )}
            </form>
          </div>
        )

      case 'activity':
        return (
          <div>
            <div className="activity-tabs">
              {activityTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`activity-tab ${activeActivityTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveActivityTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activityLoading ? (
              <div className="teacher-loading">Loading...</div>
            ) : (
              renderActivityContent()
            )}
          </div>
        )
    }
  }

  const { title, subtitle } = sectionTitles[activeSection]

  return (
    <div className="teacher-layout">
      <aside className="teacher-sidebar">
        <div className="teacher-sidebar-header">
          <div className="teacher-sidebar-logo">
            <div className="teacher-sidebar-logo-icon">A</div>
            <span className="teacher-sidebar-logo-text">Abjad School</span>
          </div>
        </div>

        <nav className="teacher-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`teacher-sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => { setActiveSection(item.key); clearFormState() }}
            >
              <span className="teacher-sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="teacher-sidebar-footer">
          <button className="teacher-sidebar-logout"  onClick={handleLogout}>
            <span className="teacher-sidebar-item-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="teacher-content">
        <div className="teacher-content-header">
          <div>
            <h1 className="teacher-content-title">{title}</h1>
            <p className="teacher-content-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="teacher-content-body">{renderContent()}</div>
      </main>
    </div>
  )
}
