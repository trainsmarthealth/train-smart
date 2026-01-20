import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

function AuthModal({ onClose }) {
    const { sendMagicLink } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [sent, setSent] = useState(false)

    const handleSendLink = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await sendMagicLink(email)

        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal glass-panel-heavy" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Schließen">
                    ✕
                </button>

                {sent ? (
                    <>
                        <div className="auth-header">
                            <div className="auth-success-icon">📧</div>
                            <h2 className="auth-title text-gradient">
                                E-Mail gesendet!
                            </h2>
                            <p className="auth-subtitle text-muted">
                                Wir haben einen Anmelde-Link an <strong>{email}</strong> gesendet.
                            </p>
                        </div>

                        <div className="auth-instructions">
                            <p>Öffne die E-Mail und klicke auf den Link, um dich anzumelden.</p>
                            <p className="text-small text-muted">
                                Schau auch im Spam-Ordner nach, falls du keine E-Mail siehst.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setSent(false)
                                setEmail('')
                            }}
                        >
                            Andere E-Mail verwenden
                        </button>
                    </>
                ) : (
                    <>
                        <div className="auth-header">
                            <h2 className="auth-title text-gradient">
                                Anmelden
                            </h2>
                            <p className="auth-subtitle text-muted">
                                Gib deine E-Mail ein – wir senden dir einen Anmelde-Link.
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSendLink} className="auth-form">
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="deine@email.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="btn btn-primary auth-submit"
                                disabled={loading}
                            >
                                {loading ? 'Wird gesendet...' : 'Link senden'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthModal
