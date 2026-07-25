import { useEffect, useState } from "react"
import api from '../../api/axios'



export function Overview() {


  const [stats , setStats] = useState({
    students:0,
    teachers:0,
    parents:0,
    classes:0
  });

  useEffect(()=>{
    const fetchStats = async ()=>{
      const [students,teachers,parents,classes] = await Promise.all([
        api.get("/student"),
        api.get("teacher"),
        api.get("parent"),
        api.get("classes")
        
      ])
      setStats({
        students: students.data.length,
        teachers: teachers.data.length,
        parents: parents.data.length,
        classes: classes.data.length
      })
    }
    fetchStats();
  })



  const stats2 = [
    { label: 'Total Students', value: stats.students, icon: '👨‍🎓' },
    { label: 'Total Teachers', value: stats.teachers, icon: '👨‍🏫' },
    { label: 'Total Parents', value: stats.parents, icon: '👨‍👩‍👧' },
    { label: 'Total Classes', value: stats.classes, icon: '📚'},
  ]

  return (
    <div className="stat-cards">
      {stats2.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-card-header">
            <span className="stat-card-label">{stat.label}</span>
            <span className="stat-card-icon">{stat.icon}</span>
          </div>
          <div className="stat-card-value">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}
