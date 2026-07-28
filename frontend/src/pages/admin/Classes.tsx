import { useState ,useEffect} from 'react'
import api from "../../api/axios"
import { MdDelete } from "react-icons/md";

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
  students:Student[],
  teachers:Teacher[],
}


export function Classes() {
  const [classes, setClasses] = useState<Class[]>([])   
  const [addClass,setAddClass] = useState({
    name:"",
    level:""
  })



  useEffect(()=>{
    const fetchClasses = async ()=>{
      const {data} = await api.get('/classes')
      setClasses(data);
      // setFormData(prev => ({ ...prev, classId: data[0]?.id }))
    }
    fetchClasses()
  },[])
  console.log(classes)

  const handleAddClass = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
    setAddClass({...addClass,[e.target.name]: e.target.value})
  }

  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault()
    try {
      
      await api.post("/classes",addClass);
      const {data} = await api.get("/classes")
      setClasses(data);

    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (classId: string) => {
    try {
      await api.delete(`/classes/${classId}`)
      const { data } = await api.get('/classes')
      setClasses(data)
    } catch (err) {
      console.log('Error deleting classes', err)
    }
  }

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          Classes <span className="section-count">({classes.length})</span>
        </h2>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Numbrer of Teachers</th>
              <th>Number of Students</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.teachers?.length}</td>
                <td>{cls.students?.length}</td>
                <td>
                  <MdDelete 
                    onClick={() => handleDelete(cls.id)} 
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit}>
          <div className="form-card">
          <h3 className="form-title">Add New Class</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Class Name</label>
              <input className="form-input" name='name' type="text" placeholder="e.g. Class D"  onChange={handleAddClass}/>
            </div>


            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-select" name='level' onChange={handleAddClass} >
                <option value="">Select Level</option>
                <option value="Primary">Primary</option>
                <option value="Mid">Mid</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-secondary" type="button">Cancel</button>
            <button className="btn-primary" type="submit">Add Class</button>
          </div>
        </div>
      </form> 

      
    </>
  )
}
