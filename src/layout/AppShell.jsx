import { useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import './AppShell.css'

function AppShell({ children }) {
    const location = useLocation()

    return (
        <div className="app-shell">
            <main className="app-main">
                <div className="page-container animate-fade-in" key={location.pathname}>
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default AppShell
