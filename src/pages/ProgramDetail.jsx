import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProgram, getExercises, hasAccessToProgram, verifyPurchase } from '../services/dataService'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import './ProgramDetail.css'

function ProgramDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const [program, setProgram] = useState(null)
    const [exercises, setExercises] = useState([])
    const [hasAccess, setHasAccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [recoveryResult, setRecoveryResult] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)

            const programData = await getProgram(id)
            if (!programData) {
                navigate('/programs')
                return
            }

            setProgram(programData)

            const exercisesData = await getExercises(id)
            setExercises(exercisesData)

            const access = await hasAccessToProgram(id)
            setHasAccess(access)

            setLoading(false)
        }

        fetchData()
    }, [id, navigate, isAuthenticated])

    const handleExerciseClick = (exercise) => {
        if (hasAccess || program?.is_free) {
            navigate(`/player/${id}/${exercise.id}`)
        } else if (!isAuthenticated) {
            setShowAuthModal(true)
        }
    }

    const handlePurchase = () => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            // TODO: Implement payment flow
            alert('Zahlungsflow wird implementiert...')
        }
    }

    const handleVerifyPurchase = async () => {
        setVerifying(true)
        setRecoveryResult(null)

        const result = await verifyPurchase(id)
        setRecoveryResult(result)

        if (result.success) {
            // Refresh access status
            const access = await hasAccessToProgram(id)
            setHasAccess(access)
        }

        setVerifying(false)
    }

    if (loading) {
        return (
            <div className="program-detail-page">
                <div className="loading-state glass-panel flex-center">
                    <span className="animate-pulse">Laden...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="program-detail-page">
            <header className="detail-header">
                <button className="back-button" onClick={() => navigate('/programs')}>
                    ← Zurück
                </button>
                <div className="detail-thumbnail">
                    <span className="thumbnail-icon">
                        {program.category === 'ruecken' ? '🏃' :
                            program.category === 'huefte' ? '🧘' :
                                program.category === 'knie' ? '💪' :
                                    program.category === 'welcome' ? '👋' : '📋'}
                    </span>
                </div>
                <h1 className="detail-title text-gradient">{program.title}</h1>
                <p className="detail-meta text-muted">
                    {program.exercise_count} Übungen • {program.duration_minutes} Min
                </p>
                {program.description && (
                    <p className="detail-description">{program.description}</p>
                )}
            </header>

            {!hasAccess && !program.is_free && (
                <section className="purchase-banner glass-panel">
                    <div className="purchase-info">
                        <span className="purchase-price">
                            {(program.price_cents / 100).toFixed(2).replace('.', ',')} €
                        </span>
                        <span className="purchase-label">Einmaliger Kauf</span>
                    </div>
                    <div className="purchase-actions">
                        <button className="btn btn-accent" onClick={handlePurchase}>
                            Jetzt kaufen
                        </button>
                        {isAuthenticated && (
                            <button
                                className="btn btn-secondary btn-small"
                                onClick={handleVerifyPurchase}
                                disabled={verifying}
                            >
                                {verifying ? 'Prüfe...' : 'Kauf überprüfen'}
                            </button>
                        )}
                    </div>
                </section>
            )}

            {recoveryResult && (
                <div className={`recovery-result glass-panel ${recoveryResult.success ? 'success' : 'error'}`}>
                    <p>{recoveryResult.message}</p>
                    {recoveryResult.supportEmail && (
                        <a href={`mailto:${recoveryResult.supportEmail}`} className="support-link">
                            Support kontaktieren
                        </a>
                    )}
                    <button
                        className="close-result"
                        onClick={() => setRecoveryResult(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            <section className="exercises-section">
                <h2 className="section-title">Übungen</h2>
                <div className="exercises-list">
                    {exercises.map((exercise, index) => (
                        <button
                            key={exercise.id}
                            className={`exercise-item glass-panel ${!hasAccess && !program.is_free ? 'locked' : ''}`}
                            onClick={() => handleExerciseClick(exercise)}
                            disabled={!hasAccess && !program.is_free}
                        >
                            <span className="exercise-number">{index + 1}</span>
                            <div className="exercise-info">
                                <span className="exercise-title">{exercise.title}</span>
                                <span className="exercise-duration text-muted">
                                    {Math.floor(exercise.duration_seconds / 60)}:{String(exercise.duration_seconds % 60).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="exercise-action">
                                {hasAccess || program.is_free ? '▶' : '🔒'}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    )
}

export default ProgramDetail
