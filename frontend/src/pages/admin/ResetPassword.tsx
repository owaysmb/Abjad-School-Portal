import { useEffect, useState } from 'react'
import api from '../../api/axios'

interface RoleUser {
  id: string
  user: { id: string; name: string; email: string; role: string }
}

interface UserRow {
  userId: string
  name: string
  email: string
  role: string
}

export function ResetPassword() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const [studentsRes, teachersRes, parentsRes] = await Promise.all([
          api.get<RoleUser[]>('/student'),
          api.get<RoleUser[]>('/teacher'),
          api.get<RoleUser[]>('/parent'),
        ])
        const rows: UserRow[] = [
          ...studentsRes.data.map((s) => ({ userId: s.user.id, name: s.user.name, email: s.user.email, role: 'Student' })),
          ...teachersRes.data.map((t) => ({ userId: t.user.id, name: t.user.name, email: t.user.email, role: 'Teacher' })),
          ...parentsRes.data.map((p) => ({ userId: p.user.id, name: p.user.name, email: p.user.email, role: 'Parent' })),
        ]
        setUsers(rows)
      } catch {
        setMessage({ type: 'error', text: 'Failed to load users.' })
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return

    if (!password) {
      setMessage({ type: 'error', text: 'New password is required.' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    try {
      await api.put('/auth/reset-password', { userId: editingUserId, newPassword: password })
      setMessage({ type: 'success', text: 'Password reset successfully.' })
      setEditingUserId(null)
      setPassword('')
      setConfirmPassword('')
    } catch {
      setMessage({ type: 'error', text: 'Failed to reset password.' })
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          Users <span className="section-count">({users.length})</span>
        </h2>
      </div>

      {message && (
        <div className={`form-message ${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <div className="table-card">
          <div className="table-empty">Loading...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="table-card">
          <div className="table-empty">No users found.</div>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                editingUserId === u.userId ? (
                  <tr key={u.userId}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="status-badge active">{u.role}</span>
                    </td>
                    <td>
                      <form className="reset-password-form" onSubmit={handleReset}>
                        <input
                          className="form-input"
                          type="password"
                          placeholder="New password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                          className="form-input"
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="btn-primary" type="submit">Reset</button>
                        <button
                          className="btn-secondary"
                          type="button"
                          onClick={() => { setEditingUserId(null); setPassword(''); setConfirmPassword(''); setMessage(null) }}
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.userId}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="status-badge active">{u.role}</span>
                    </td>
                    <td>
                      <button
                        className="reset-password-btn"
                        onClick={() => { setMessage(null); setPassword(''); setConfirmPassword(''); setEditingUserId(u.userId) }}
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
