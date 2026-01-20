import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserEntitlements } from '../services/dataService'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import './MyContent.css'

function MyContent() {
    const navigate = useNavigate()
    const { isAuthenticated, loading: authLoading } = useAuth()

    const [entitlements, setEntitlements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAuthModal, setShowAuthModal] = useState(false)

    useEffect(() => {
        async function fetchEntitlements() {
            if (!isAuthenticated) {
                setLoading(false)
                return
            }

            setLoading(true)
            const data = await getUserEntitlements()
            setEntitlements(data)
            setLoading(false)
        }

        if (!authLoading) {
            fetchEntitlements()
        }
    }, [isAuthenticated, authLoading])

    const handleProgramClick = (program) => {
        navigate(`/program/${program.id}`)
    }

    const handleDiscoverClick = () => {
        navigate('/programs')
    }

    // Show loading while auth is loading
    if (authLoading) {
        return (
            <div className="mycontent-page">
                <header className="page-header">
                    <h1 className="page-title">
                        <span className="text-gradient">Meine Inhalte</span>
                    </h1>
                </header>
                <section className="loading-state">
                    <div className="loading-skeleton card"></div>
                    <div className="loading-skeleton card"></div>
                </section>
            </div>
        )
    }

    // Not authenticated - show login prompt
    if (!isAuthenticated) {
        return (
            <div className="mycontent-page">
                <header className="page-header">
                    <h1 className="page-title">
                        <span className="text-gradient">Meine Inhalte</span>
                    </h1>
                    <p className="page-subtitle text-muted">
                        Deine gekauften Programme
                    </p>
                </header>

                <section className="empty-state glass-panel">
                    <div className="empty-icon">🔐</div>
                    <h2 className="empty-title">Anmeldung erforderlich</h2>
                    <p className="empty-description text-muted">
                        Melde dich an, um deine gekauften Programme zu sehen.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAuthModal(true)}
                    >
                        Anmelden
                    </button>
                </section>

                {showAuthModal && (
                    <AuthModal onClose={() => setShowAuthModal(false)} />
                )}
            </div>
        )
    }

    return (
        <div className="mycontent-page">
            <header className="page-header">
                <h1 className="page-title">
                    <span className="text-gradient">Meine Inhalte</span>
                </h1>
                <p className="page-subtitle text-muted">
                    Deine gekauften Programme
                </p>
            </header>

            {loading ? (
                <section className="loading-state">
                    <div className="loading-skeleton card"></div>
                    <div className="loading-skeleton card"></div>
                    <div className="loading-skeleton card"></div>
                </section>
            ) : entitlements.length === 0 ? (
                <section className="empty-state glass-panel">
                    <div className="empty-icon">📦</div>
                    <h2 className="empty-title">Noch keine Inhalte</h2>
                    <p className="empty-description text-muted">
                        Kaufe ein Programm, um hier deine Trainingsvideos zu sehen.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleDiscoverClick}
                    >
                        Programme entdecken
                    </button>
                </section>
            ) : (
                <section className="content-grid">
                    {entitlements.map((entitlement, index) => {
                        const program = entitlement.programs
                        if (!program) return null

                        return (
                            <article
                                key={entitlement.id}
                                className="content-card card"
                                onClick={() => handleProgramClick(program)}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="content-thumbnail">
                                    <div className="thumbnail-placeholder">
                                        {program.category === 'ruecken' ? '🏃' :
                                            program.category === 'huefte' ? '🧘' :
                                                program.category === 'knie' ? '💪' :
                                                    program.category === 'welcome' ? '👋' : '📋'}
                                    </div>
                                    {entitlement.is_subscriber && (
                                        <span className="subscriber-badge">Abo</span>
                                    )}
                                </div>
                                <div className="content-info">
                                    <h3 className="content-title">{program.title}</h3>
                                    <p className="content-meta text-muted">
                                        {program.exercise_count} Übungen • {program.duration_minutes} Min
                                    </p>
                                    <div className="content-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: '0%' }}
                                            ></div>
                                        </div>
                                        <span className="progress-text text-muted">
                                            Noch nicht gestartet
                                        </span>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </section>
            )}
        </div>
    )
}

export default MyContent
