import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const tabs = [
    { path: '/programs', label: 'Programme', icon: '📋' },
    { path: '/mycontent', label: 'Meine Inhalte', icon: '🎬' },
    { path: '/profile', label: 'Profil', icon: '👤' }
]

function BottomNav() {
    return (
        <nav className="bottom-nav glass-panel-heavy safe-bottom">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label={tab.label}
                >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                </NavLink>
            ))}
        </nav>
    )
}

export default BottomNav
