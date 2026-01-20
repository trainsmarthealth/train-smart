import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPrograms } from '../services/dataService'
import './Programs.css'

// Category emoji mapping
const categoryIcons = {
    ruecken: '🏃',
    huefte: '🧘',
    knie: '💪',
    welcome: '👋',
    default: '📋'
}

function Programs() {
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchPrograms() {
            setLoading(true)
            const data = await getPrograms()
            setPrograms(data)
            setLoading(false)
        }
        fetchPrograms()
    }, [])

    const handleProgramClick = (program) => {
        navigate(`/program/${program.id}`)
    }

    return (
        <div className="programs-page">
            <header className="page-header">
                <h1 className="page-title">
                    <span className="text-gradient">Programme</span>
                </h1>
                <p className="page-subtitle text-muted">
                    Entdecke Trainingsprogramme für deine Gesundheit
                </p>
            </header>

            {loading ? (
                <section className="loading-state">
                    <div className="loading-skeleton card"></div>
                    <div className="loading-skeleton card"></div>
                    <div className="loading-skeleton card"></div>
                </section>
            ) : programs.length === 0 ? (
                <section className="empty-state glass-panel">
                    <div className="empty-icon">📋</div>
                    <h2 className="empty-title">Keine Programme verfügbar</h2>
                    <p className="empty-description text-muted">
                        Bitte später erneut versuchen.
                    </p>
                </section>
            ) : (
                <section className="programs-grid">
                    {programs.map((program, index) => (
                        <article
                            key={program.id}
                            className="program-card card"
                            onClick={() => handleProgramClick(program)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="program-thumbnail">
                                <div className="thumbnail-placeholder">
                                    {categoryIcons[program.category] || categoryIcons.default}
                                </div>
                                {program.is_free && (
                                    <span className="free-badge">Kostenlos</span>
                                )}
                            </div>
                            <div className="program-info">
                                <h3 className="program-title">{program.title}</h3>
                                <p className="program-meta text-muted">
                                    {program.exercise_count} Übungen • {program.duration_minutes} Min
                                </p>
                                {!program.is_free && program.price_cents && (
                                    <p className="program-price">
                                        {(program.price_cents / 100).toFixed(2).replace('.', ',')} €
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}

export default Programs
