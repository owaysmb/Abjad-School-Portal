import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import { MdDelete } from "react-icons/md";

interface Parent {
  id:string,
  user:{
    createdAt:string,
    email:string,
    id:string,
    name:string,
    role:string
  },
  children:{
    parentId:string,
    student:{
      user:{
      name:string
    },
    }
  }[]
}

interface Student {
  id: string
  level: string
  classId: string
  userId: string
  class: {
    id: string
    name: string
    level: string
  }
  user: {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }
  parents: {
    parent: {
      user: {
        name: string
        email: string
      }
    }
  }[]
}

export function Parents() {
  const [parents,setParents] = useState<Parent[]>([]);
  
  const [addParent,setAddParent] = useState({
    name:"",
    email:"",
    password:"",
  })
  const [assignData, setAssignData] = useState({
    parentId: '',
    studentId: ''
  })

  const [addParentMsg, setAddParentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [assignMsg, setAssignMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await api.get('/student')
      setStudents(data)
      setAssignData(prev => ({ ...prev, studentId: data[0]?.id }))
    }
    fetchStudents()
  }, [])
  console.log(students)
  useEffect(() => {
    const fetchParents = async () => {
      const { data } = await api.get('/parent')
      setParents(data)
      setAssignData(prev => ({ ...prev, parentId: data[0]?.id }))
    }
    fetchParents()
  }, [])

    const handleAssignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setAssignData({ ...assignData, [e.target.name]: e.target.value })
    }

    const handleAssignSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await api.post('/parent/assign', assignData)
        const { data } = await api.get('/parent')
        setParents(data)
        setAssignMsg({ type: 'success', text: 'Child assigned to parent successfully.' })
        setAssignData({ parentId: parents[0]?.id ?? '', studentId: students[0]?.id ?? '' })
      } catch (err) {
        console.log(err)
        setAssignMsg({ type: 'error', text: 'Failed to assign child.' })
      }
    }



  const handleAddParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddParent({ ...addParent, [e.target.name]: e.target.value })
  }

  const SubmitAddParent = async(e:React.FormEvent)=>{
    e.preventDefault();
    try {
      
      await api.post("/parent",addParent)
      const {data} = await api.get('/parent');
      setParents(data);
      setAddParentMsg({ type: 'success', text: 'Parent added successfully.' })
      setAddParent({ name: "", email: "", password: "" })

    } catch (err) {
      console.log(err);
      setAddParentMsg({ type: 'error', text: 'Failed to add parent.' })
    }
  }

    const handleDelete = async (parentId: string) => {
      try {
        await api.delete(`/parent/${parentId}`)
        const { data } = await api.get('/parent')
        setParents(data)
      } catch (err) {
        console.log('Error deleting parent', err)
      }
    }


  console.log(parents)

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
              <th>Children</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id}>
                <td>{parent.user?.name}</td>
                <td>{parent.user?.email}</td>
                <td>{parent.children?.map(c => c.student?.user.name).join(', ')}</td>
                <td>
                  <MdDelete 
                    onClick={() => handleDelete(parent.id)} 
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    <form onSubmit={SubmitAddParent}>
      <div className="form-card">
        <h3 className="form-title">Add New Parent</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name='name' type="text" placeholder="Enter parent name" onChange={handleAddParent} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name='email' type="email" placeholder="parent@email.com" onChange={handleAddParent} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name='password' type="password" placeholder="Enter Password" onChange={handleAddParent} required />
          </div>

        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="submit">Add Parent</button>
        </div>
        {addParentMsg && (
          <div className={`form-message ${addParentMsg.type}`}>{addParentMsg.text}</div>
        )}
      </div>
    </form>
      

            <br />
    <form onSubmit={handleAssignSubmit}>
        <div className="form-card">
          <h3 className="form-title">Assign a Parent</h3>
          <div className="form-group">
              <label className="form-label">Parent </label>
              <select className="form-select" name="parentId" onChange={handleAssignChange} required>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.user?.name}
                </option>
              ))}
            </select>
            </div>
            <br />
            <div className="form-group">
              <label className="form-label">Children</label>
              <select className="form-select" name="studentId" onChange={handleAssignChange} required>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user?.name}
                  </option>
                ))}
              </select>
            </div>
          <div className="form-actions">
            <button className="btn-secondary" type="button">Cancel</button>
            <button className="btn-primary" type="submit">Assign</button>
          </div>
          {assignMsg && (
            <div className={`form-message ${assignMsg.type}`}>{assignMsg.text}</div>
          )}
        </div>
    </form>
      

    </>
  )
}
