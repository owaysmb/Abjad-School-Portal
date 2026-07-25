import { useEffect, useState } from 'react'
import api from '../../api/axios'

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

// interface Parent {
//   id :string,
//   userId:string,
//   user:{
//     email:string ,
//     id :string,
//     createdAt:string,
//     name:string,
//     role:string,

//   }
// }

interface Class{
  id:string,
  level:string,
  name:string,
}

export function Students() {

  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: '',
    classId: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    setFormData({...formData,[e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    try {
      console.log(formData)
      await api.post('/student',formData);
      const { data } = await api.get('/student')
      setStudents(data)

    } catch (err) {
      console.log("couldnt submit student", err)
    }
  }

  useEffect(()=>{

    const fetchStudents = async ()=>{
      const {data}= await api.get('/student')
      setStudents(data);
    }
    fetchStudents()
  },[])

  useEffect(()=>{
    const fetchClasses = async ()=>{
      const {data} = await api.get('/classes')
      setClasses(data);
      setFormData(prev => ({ ...prev, classId: data[0]?.id }))
    }
    fetchClasses()
  },[])

console.log(classes)
console.log(students)


  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          Students <span className="section-count">({students?.length})</span>
        </h2>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>level</th>
              <th>Parent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.user.id}>
                <td>{student?.user?.name}</td>
                <td>{student?.user.email}</td>
                <td>{student?.class.name}</td>
                <td>{student?.level}</td>
                <td>{student?.parents?.map((p) => p?.parent?.user?.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3 className="form-title">Add New Student</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name='name'  type="text" placeholder="Enter student name" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name='email' type="email" placeholder="student@school.com" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name='password' type="password" placeholder="Enter student's password" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Level</label>
            <select className="form-select" name='level' onChange={handleChange}>
              <option value="">Select Level</option>
              <option value="Primary">Primary</option>
              <option value="Mid">Mid</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Class</label>
            <select name="classId" onChange={handleChange} className="form-select">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
</select>
          </div>
          
        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="submit">Add Student</button>
        </div>
      </form>
    </>
  )
}
