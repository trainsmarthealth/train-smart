import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProgram, getExercises, updateProgress } from '../services/dataService'
import './Player.css'

function Player() {
    const { programId, exerciseId } = useParams()
    const navigate = useNavigate()
    const videoRef = useRef(null)

    const [program, setProgram] = useState(null)
    const [exercises, setExercises] = useState([])
    const [currentExercise, setCurrentExercise] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // Fetch program and exercises
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)

            try {
                const programData = await getProgram(programId)
                if (!programData) {
                    setError('Programm nicht gefunden')
                    setLoading(false)
                    return
                }
                setProgram(programData)

                const exercisesData = await getExercises(programId)
                setExercises(exercisesData)

                // Find current exercise
                const exerciseIndex = exercisesData.findIndex(e => e.id === exerciseId)
                if (exerciseIndex === -1) {
                    setError('Übung nicht gefunden')
                    setLoading(false)
                    return
                }

                setCurrentIndex(exerciseIndex)
                setCurrentExercise(exercisesData[exerciseIndex])
                setLoading(false)
            } catch (err) {
                console.error('Error loading player:', err)
                setError('Fehler beim Laden')
                setLoading(false)
            }
        }

        fetchData()
    }, [programId, exerciseId])

    // Handle progress updates
    const handleTimeUpdate = () => {
        if (!videoRef.current || !currentExercise) return

        const position = Math.floor(videoRef.current.currentTime)
        const duration = videoRef.current.duration || 0
        const completed = duration > 0 && position >= duration - 2

        // Debounce: only update every 5 seconds
        if (position % 5 === 0 && position > 0) {
            updateProgress(currentExercise.id, position, completed)
        }
    }

    const handleVideoEnded = () => {
        if (currentExercise) {
            updateProgress(currentExercise.id, currentExercise.duration_seconds, true)
        }
        setIsPlaying(false)
    }

    const handleVideoError = () => {
        setError('Video konnte nicht geladen werden. Bitte später erneut versuchen.')
    }

    // Navigation
    const handleBack = () => {
        navigate(`/program/${programId}`)
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevExercise = exercises[currentIndex - 1]
            navigate(`/player/${programId}/${prevExercise.id}`)
        }
    }

    const handleNext = () => {
        if (currentIndex < exercises.length - 1) {
            const nextExercise = exercises[currentIndex + 1]
            navigate(`/player/${programId}/${nextExercise.id}`)
        }
    }

    if (loading) {
        return (
            <div className="player-page">
                <div className="player-loading glass-panel">
                    <span className="animate-pulse">Laden...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="player-page">
                <div className="player-error glass-panel">
                    <div className="error-icon">⚠️</div>
                    <p className="error-message">{error}</p>
                    <button className="btn btn-primary" onClick={handleBack}>
                        Zurück zum Programm
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="player-page">
            {/* Header */}
            <header className="player-header">
                <button className="back-button" onClick={handleBack}>
                    ← Zurück
                </button>
                <div className="header-info">
                    <span className="header-program text-muted">{program?.title}</span>
                    <h1 className="header-title">{currentExercise?.title}</h1>
                </div>
                <span className="header-counter text-muted">
                    {currentIndex + 1} / {exercises.length}
                </span>
            </header>

            {/* Video Container */}
            <div className="video-container">
                {currentExercise?.video_url ? (
                    <video
                        ref={videoRef}
                        className="video-player"
                        src={currentExercise.video_url}
                        controls
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                ) : (
                    <div className="video-placeholder">
                        <div className="placeholder-icon">🎬</div>
                        <p className="placeholder-text">Video nicht verfügbar</p>
                    </div>
                )}
            </div>

            {/* Exercise Info */}
            <section className="exercise-info glass-panel">
                <h2 className="exercise-title">{currentExercise?.title}</h2>
                {currentExercise?.description && (
                    <p className="exercise-description text-muted">
                        {currentExercise.description}
                    </p>
                )}
                <div className="exercise-meta">
                    <span className="meta-item">
                        ⏱ {Math.floor(currentExercise?.duration_seconds / 60)}:{String(currentExercise?.duration_seconds % 60).padStart(2, '0')}
                    </span>
                </div>
            </section>

            {/* Navigation Controls */}
            <nav className="player-nav">
                <button
                    className="nav-button btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    ← Vorherige
                </button>
                <button
                    className="nav-button btn btn-primary"
                    onClick={handleNext}
                    disabled={currentIndex === exercises.length - 1}
                >
                    Nächste →
                </button>
            </nav>
        </div>
    )
}

export default Player
