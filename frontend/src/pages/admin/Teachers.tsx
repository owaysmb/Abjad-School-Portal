import { useEffect, useState } from 'react'
import api from '../../api/axios'



interface Teacher {
  id: string,
  user: {
    createdAt: string,
    email: string,
    userId: string,
    name: string,
    role: string
  },
  classes: {
    subject: string,
    class: {
      id: string,
      name: string,
      level: string
    }
  }[]
}
interface Class{
  id:string,
  level:string,
  name:string,
}



export function Teachers() {

  const [teachers,setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])

    const [AddTeacherformData, AddTeachersetFormData] = useState({
      name: '',
      email: '',
      password: '',
    })
    
    const [AssignTeacherFormData,AssignTeachersetFormData] = useState({
      teacherId:' ',
      subject:'',
      classId:''
    })


  useEffect(()=>{

    const fetchTeachers = async ()=>{
      const {data} = await api.get('/teacher');
      setTeachers(data);
      AssignTeachersetFormData(prev => ({ ...prev, teacherId: data[0]?.id }))
    }
    fetchTeachers();
  },[])



  const handleAddnewTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    AddTeachersetFormData({...AddTeacherformData,[e.target.name]: e.target.value})
  }

  const handleAssignTeacher = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    AssignTeachersetFormData({...AssignTeacherFormData,[e.target.name]: e.target.value})
  }

    useEffect(()=>{
    const fetchClasses = async ()=>{
      const {data} = await api.get('/classes')
      setClasses(data);
      AssignTeachersetFormData(prev => ({ ...prev, classId: data[0]?.id }))  
    }
    fetchClasses()
  },[])

    const handleSubmitTeacher = async (e: React.FormEvent)=>{
    e.preventDefault();
    try {
      console.log(AddTeacherformData)
      await api.post('/teacher',AddTeacherformData);
      const { data } = await api.get('/teacher')
      setTeachers(data)

    } catch (err) {
      console.log("couldnt submit teacher", err)
    }
  }

  const handleSubmitAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(AssignTeacherFormData)
      await api.post('/teacher/assign', AssignTeacherFormData)
    } catch (err) {
      console.log('Error assigning teacher', err)
    }
  }

  console.log(teachers);

  return (
    <>
      <form onSubmit={handleSubmitTeacher}>
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
                <th>Class</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.user.name}</td>
                  <td>{teacher.user.email}</td>
                  <td>{[...new Set(teacher.classes.map(c => c.subject))].join(', ')}</td>
                  <td>{[...new Set(teacher.classes.map(c => c.class.name))].join(', ')}</td>
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
              <input className="form-input" name='name' type="text" placeholder="Enter teacher name"  onChange={handleAddnewTeacherChange}/>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name='email' type="email" placeholder="teacher@school.com"  onChange={handleAddnewTeacherChange}/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name='password' type="tel" placeholder="Enter Password" onChange={handleAddnewTeacherChange} />
            </div> 
            
          </div>
          <div className="form-actions">
            <button className="btn-secondary" type="button">Cancel</button>
            <button className="btn-primary" type="submit">Add Teacher</button>
          </div>
        </div>
      </form>
     

              <br />
    <form onSubmit={handleSubmitAssign}>
      <div className="form-card">
        <h3 className="form-title">Assign Teacher's Job</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Teacher</label>
            <select name="teacherId" className="form-select" onChange={handleAssignTeacher} >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.user.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Class</label>
            <select name="classId" onChange={handleAssignTeacher} className="form-select">
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="form-select" name="subject"  onChange={handleAssignTeacher}  >
                <option value="">Select subject</option>
                <option value="math">Mathematics</option>
                <option value="english">English</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="arabic">Arabic</option>
              </select>
            </div>  
          
        </div>
        <div className="form-actions">
          <button className="btn-secondary" type="button">Cancel</button>
          <button className="btn-primary" type="submit">Assign</button>
        </div>
      </div>
    </form> 
      
    </>
  )
}
