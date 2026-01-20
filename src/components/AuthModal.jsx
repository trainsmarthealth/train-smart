import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

function AuthModal({ onClose }) {
    const { sendOtp, verifyOtp } = useAuth()
    const [step, setStep] = useState('email') // 'email' | 'otp'
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await sendOtp(email)

        if (error) {
            setError(error.message)
        } else {
            setStep('otp')
        }
        setLoading(false)
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await verifyOtp(email, otp)

        if (error) {
            // Show user-friendly error message
            if (error.message.includes('expired') || error.message.includes('invalid')) {
                setError('Der Code ist ungültig oder abgelaufen. Bitte fordere einen neuen Code an.')
            } else {
                setError(error.message)
            }
        } else {
            onClose?.()
        }
        setLoading(false)
    }

    const handleResendCode = async () => {
        setLoading(true)
        setError(null)
        setOtp('')

        const { error } = await sendOtp(email)

        if (error) {
            setError(error.message)
        } else {
            setError(null)
            // Show success message briefly
            setError('✅ Neuer Code gesendet!')
            setTimeout(() => setError(null), 3000)
        }
        setLoading(false)
    }

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal glass-panel-heavy" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Schließen">
                    ✕
                </button>

                <div className="auth-header">
                    <h2 className="auth-title text-gradient">
                        {step === 'email' ? 'Anmelden' : 'Code eingeben'}
                    </h2>
                    <p className="auth-subtitle text-muted">
                        {step === 'email'
                            ? 'Gib deine E-Mail ein, um einen 8-stelligen Code zu erhalten'
                            : `Wir haben einen 8-stelligen Code an ${email} gesendet`
                        }
                    </p>
                </div>

                {error && (
                    <div className={`auth-error ${error.startsWith('✅') ? 'auth-success' : ''}`}>
                        {error}
                    </div>
                )}

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className="auth-form">
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
                            {loading ? 'Wird gesendet...' : 'Code senden'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <input
                            type="text"
                            className="auth-input auth-input-otp"
                            placeholder="00000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            required
                            autoFocus
                            inputMode="numeric"
                            autoComplete="one-time-code"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={loading || otp.length !== 8}
                        >
                            {loading ? 'Wird überprüft...' : 'Bestätigen'}
                        </button>
                        <div className="auth-actions">
                            <button
                                type="button"
                                className="btn-link"
                                onClick={handleResendCode}
                                disabled={loading}
                            >
                                Code erneut senden
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => {
                                    setStep('email')
                                    setOtp('')
                                    setError(null)
                                }}
                            >
                                Andere E-Mail
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthModal
