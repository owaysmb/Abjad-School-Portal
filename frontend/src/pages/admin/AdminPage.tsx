import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Overview } from './Overview'
import { Students } from './Students'
import { Teachers } from './Teachers'
import { Parents } from './Parents'
import { Classes } from './Classes'
import './AdminPage.css'
import { useAuth } from '../../context/AuthContext'

type Section = 'overview' | 'students' | 'teachers' | 'parents' | 'classes'

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'students', label: 'Students', icon: '👨‍🎓' },
  { key: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
  { key: 'parents', label: 'Parents', icon: '👨‍👩‍👧' },
  { key: 'classes', label: 'Classes', icon: '📚' },
]

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard Overview', subtitle: 'Summary of school statistics' },
  students: { title: 'Students Management', subtitle: 'View and manage all students' },
  teachers: { title: 'Teachers Management', subtitle: 'View and manage all teachers' },
  parents: { title: 'Parents Management', subtitle: 'View and manage all parents' },
  classes: { title: 'Classes Management', subtitle: 'View and manage all classes' },
}

export function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const navigate = useNavigate()
  const auth = useAuth()

  const handleLogout = async () => {
    await auth?.logout()
    navigate('/login')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <Overview />
      case 'students': return <Students />
      case 'teachers': return <Teachers />
      case 'parents': return <Parents />
      case 'classes': return <Classes />
    }
  }

  const { title, subtitle } = sectionTitles[activeSection]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">A</div>
            <span className="admin-sidebar-logo-text">Abjad School</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="admin-sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-logout" onClick={handleLogout }>
            <span className="admin-sidebar-item-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-content-header">
          <div>
            <h1 className="admin-content-title">{title}</h1>
            <p className="admin-content-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="admin-content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
