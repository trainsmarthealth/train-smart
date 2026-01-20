import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './layout/AppShell'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import MyContent from './pages/MyContent'
import Profile from './pages/Profile'
import Player from './pages/Player'
import InstallPrompt from './components/InstallPrompt'
import './styles/global.css'

function App() {
  return (
    <>
      <InstallPrompt />
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/programs" replace />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/program/:id" element={<ProgramDetail />} />
          <Route path="/player/:programId/:exerciseId" element={<Player />} />
          <Route path="/mycontent" element={<MyContent />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppShell>
    </>
  )
}

export default App
