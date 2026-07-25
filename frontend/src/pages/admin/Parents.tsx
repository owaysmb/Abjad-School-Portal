import { useState } from 'react'

const mockParents = [
  { id: 1, name: 'Mohammed Ali', email: 'mohammed.ali@email.com', phone: '+966 555 111 222', children: 'Ahmed Ali' },
  { id: 2, name: 'Fatima Hassan', email: 'fatima.h@email.com', phone: '+966 555 333 444', children: 'Sara Hassan' },
  { id: 3, name: 'Ali Khalid', email: 'ali.k@email.com', phone: '+966 555 555 666', children: 'Omar Khalid' },
]

export function Parents() {
  const [parents] = useState(mockParents)

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          Parents <span className="section-count">({parents.length})</span>
        </h2>
        <button className="add-button">+ Add Parent</button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Children</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id}>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>{parent.children}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-card">
        <h3 className="form-title">Add New Parent</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="Enter parent name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="parent@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" type="tel" placeholder="+966 5XX XXX XXXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Relationship</label>
            <select className="form-select">
              <option value="">Select relationship</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label className="form-label">Address</label>
            <input className="form-input" type="text" placeholder="Enter full address" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="button">Add Parent</button>
        </div>
      </div>
    </>
  )
}
