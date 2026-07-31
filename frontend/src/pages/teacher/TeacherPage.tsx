import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import type { TeacherJob, Student, MoodType } from '../../types'
import './TeacherPage.css'
import { useAuth } from '../../context/AuthContext'

type Section = 'classes' | 'attendance' | 'feedback' | 'mood' | 'grades'

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: 'classes', label: 'My Classes', icon: '📚' },
  { key: 'attendance', label: 'Mark Attendance', icon: '📋' },
  { key: 'feedback', label: 'Add Feedback', icon: '📝' },
  { key: 'mood', label: 'Add Mood', icon: '🎭' },
  { key: 'grades', label: 'Add Grade', icon: '📊' },
]

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  classes: { title: 'My Classes', subtitle: 'Classes and subjects you teach' },
  attendance: { title: 'Mark Attendance', subtitle: 'Record student attendance' },
  feedback: { title: 'Add Feedback', subtitle: 'Write a note about a student' },
  mood: { title: 'Add Mood', subtitle: 'Record a student\'s mood' },
  grades: { title: 'Add Grade', subtitle: 'Enter a student\'s grade' },
}

const moodOptions: MoodType[] = ['focused', 'tired', 'anxious', 'hyperactive', 'happy']

export function TeacherPage() {
  const [activeSection, setActiveSection] = useState<Section>('classes')
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<TeacherJob[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

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
    setSubmitting(true)
    setFormMessage(null)
    try {
      await api.post('/grade', {
        studentId: gradeForm.studentId,
        classId: gradeForm.classId,
        subject: gradeForm.subject,
        score: parseFloat(gradeForm.score),
        maxScore: parseFloat(gradeForm.maxScore),
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
                        {s.user.name} ({s.class.name})
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
                        {s.user.name} ({s.class.name})
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
                        {s.user.name} ({s.class.name})
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
                        {s.user.name} ({s.class.name})
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
