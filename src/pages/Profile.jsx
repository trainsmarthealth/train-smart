import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import './Profile.css'

function Profile() {
    const { user, isAuthenticated, signOut, loading } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleSignOut = async () => {
        await signOut()
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-state glass-panel flex-center">
                    <span className="animate-pulse">Laden...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-page">
            <header className="page-header">
                <h1 className="page-title">
                    <span className="text-gradient">Profil</span>
                </h1>
            </header>

            <section className="profile-card glass-panel">
                <div className="profile-avatar">
                    <span className="avatar-placeholder">
                        {isAuthenticated ? '✓' : '👤'}
                    </span>
                </div>
                <div className="profile-info">
                    {isAuthenticated ? (
                        <>
                            <p className="profile-email">{user?.email}</p>
                            <button className="btn btn-secondary" onClick={handleSignOut}>
                                Abmelden
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="profile-status text-muted">Nicht angemeldet</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Anmelden
                            </button>
                        </>
                    )}
                </div>
            </section>

            <section className="settings-section">
                <h2 className="section-title">Einstellungen</h2>
                <div className="settings-list glass-panel">
                    <button className="settings-item">
                        <span className="settings-icon">🔔</span>
                        <span className="settings-label">Benachrichtigungen</span>
                        <span className="settings-arrow">›</span>
                    </button>
                    <button className="settings-item">
                        <span className="settings-icon">❓</span>
                        <span className="settings-label">Hilfe & Support</span>
                        <span className="settings-arrow">›</span>
                    </button>
                    <button className="settings-item">
                        <span className="settings-icon">📄</span>
                        <span className="settings-label">Datenschutz</span>
                        <span className="settings-arrow">›</span>
                    </button>
                </div>
            </section>

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    )
}

export default Profile
