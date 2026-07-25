import { useState } from 'react'

const mockClasses = [
  { id: 1, name: 'Class A', teacher: 'Khalid Mohammed', schedule: 'Sun - Tue, 8:00 AM', room: '101', students: 30 },
  { id: 2, name: 'Class B', teacher: 'Nora Saeed', schedule: 'Mon - Wed, 9:00 AM', room: '205', students: 28 },
  { id: 3, name: 'Class C', teacher: 'Youssef Ibrahim', schedule: 'Sun - Thu, 10:00 AM', room: '302', students: 25 },
]

export function Classes() {
  const [classes] = useState(mockClasses)

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          Classes <span className="section-count">({classes.length})</span>
        </h2>
        <button className="add-button">+ Add Class</button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Teacher</th>
              <th>Schedule</th>
              <th>Room</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.teacher}</td>
                <td>{cls.schedule}</td>
                <td>{cls.room}</td>
                <td>{cls.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-card">
        <h3 className="form-title">Add New Class</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Class Name</label>
            <input className="form-input" type="text" placeholder="e.g. Class D" />
          </div>
          <div className="form-group">
            <label className="form-label">Teacher</label>
            <select className="form-select">
              <option value="">Select teacher</option>
              <option value="1">Khalid Mohammed</option>
              <option value="2">Nora Saeed</option>
              <option value="3">Youssef Ibrahim</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Schedule</label>
            <input className="form-input" type="text" placeholder="e.g. Sun - Tue, 8:00 AM" />
          </div>
          <div className="form-group">
            <label className="form-label">Room</label>
            <input className="form-input" type="text" placeholder="e.g. 101" />
          </div>
          <div className="form-group">
            <label className="form-label">Max Capacity</label>
            <input className="form-input" type="number" placeholder="30" min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Grade Level</label>
            <select className="form-select">
              <option value="">Select grade</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="button">Add Class</button>
        </div>
      </div>
    </>
  )
}
