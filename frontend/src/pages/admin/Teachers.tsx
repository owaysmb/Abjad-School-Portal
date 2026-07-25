import { useState } from 'react'

const mockTeachers = [
  { id: 1, name: 'Khalid Mohammed', email: 'khalid.m@school.com', subject: 'Mathematics', phone: '+966 555 123 456', status: 'active' },
  { id: 2, name: 'Nora Saeed', email: 'nora.s@school.com', subject: 'English', phone: '+966 555 789 012', status: 'active' },
  { id: 3, name: 'Youssef Ibrahim', email: 'youssef.i@school.com', subject: 'Science', phone: '+966 555 345 678', status: 'inactive' },
]

export function Teachers() {
  const [teachers] = useState(mockTeachers)

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          Teachers <span className="section-count">({teachers.length})</span>
        </h2>
        <button className="add-button">+ Add Teacher</button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.phone}</td>
                <td>
                  <span className={`status-badge ${teacher.status}`}>
                    {teacher.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-card">
        <h3 className="form-title">Add New Teacher</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="Enter teacher name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="teacher@school.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-select">
              <option value="">Select subject</option>
              <option value="math">Mathematics</option>
              <option value="english">English</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" type="tel" placeholder="+966 5XX XXX XXXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Qualification</label>
            <input className="form-input" type="text" placeholder="e.g. B.Ed, M.Ed" />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input className="form-input" type="number" placeholder="0" min="0" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="button">Add Teacher</button>
        </div>
      </div>
    </>
  )
}
