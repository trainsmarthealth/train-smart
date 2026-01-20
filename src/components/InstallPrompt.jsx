import { useState, useEffect } from 'react'
import './InstallPrompt.css'

/**
 * PWA Install Prompt Component
 * - Shows on first visit (localStorage check)
 * - Detects iOS vs Android for platform-specific instructions
 * - Uses native beforeinstallprompt on Android/Chrome
 * - Dismissible with "Don't show again" option
 */
export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // Check if already installed (standalone mode)
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true
        setIsStandalone(standalone)

        // Check if dismissed before
        const dismissed = localStorage.getItem('installPromptDismissed')
        if (standalone || dismissed) return

        // Detect iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        setIsIOS(ios)

        // For Android/Chrome: capture beforeinstallprompt
        const handleBeforeInstall = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall)

        // For iOS: show prompt after short delay (no native prompt available)
        if (ios) {
            const timer = setTimeout(() => setShowPrompt(true), 2000)
            return () => clearTimeout(timer)
        }

        // Fallback: show after delay if no beforeinstallprompt (some browsers)
        const fallbackTimer = setTimeout(() => {
            if (!deferredPrompt) setShowPrompt(true)
        }, 3000)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
            clearTimeout(fallbackTimer)
        }
    }, [])

    const handleInstall = async () => {
        if (deferredPrompt) {
            // Android/Chrome native install
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                setShowPrompt(false)
                localStorage.setItem('installPromptDismissed', 'true')
            }
            setDeferredPrompt(null)
        }
        // iOS: the prompt just shows instructions, no action needed
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('installPromptDismissed', 'true')
    }

    if (!showPrompt || isStandalone) return null

    return (
        <div className="install-prompt-overlay">
            <div className="install-prompt">
                <button className="install-prompt-close" onClick={handleDismiss} aria-label="Schließen">
                    ✕
                </button>

                <div className="install-prompt-icon">📲</div>

                <h2 className="install-prompt-title">
                    App installieren
                </h2>

                <p className="install-prompt-description">
                    Installiere TrainSmart auf deinem Homescreen für schnellen Zugriff und
                    ein besseres Erlebnis – wie eine echte App!
                </p>

                {isIOS ? (
                    <div className="install-prompt-ios">
                        <p className="install-prompt-steps-title">So geht's auf iOS:</p>
                        <ol className="install-prompt-steps">
                            <li>
                                <span className="step-icon">□↑</span>
                                Tippe auf <strong>Teilen</strong> unten
                            </li>
                            <li>
                                <span className="step-icon">＋</span>
                                Wähle <strong>"Zum Home-Bildschirm"</strong>
                            </li>
                            <li>
                                <span className="step-icon">✓</span>
                                Tippe <strong>"Hinzufügen"</strong>
                            </li>
                        </ol>
                    </div>
                ) : (
                    <div className="install-prompt-android">
                        {deferredPrompt ? (
                            <button className="install-prompt-button" onClick={handleInstall}>
                                Jetzt installieren
                            </button>
                        ) : (
                            <>
                                <p className="install-prompt-steps-title">So geht's:</p>
                                <ol className="install-prompt-steps">
                                    <li>
                                        <span className="step-icon">⋮</span>
                                        Tippe auf <strong>Menü</strong> (⋮) oben rechts
                                    </li>
                                    <li>
                                        <span className="step-icon">＋</span>
                                        Wähle <strong>"App installieren"</strong>
                                    </li>
                                </ol>
                            </>
                        )}
                    </div>
                )}

                <button className="install-prompt-later" onClick={handleDismiss}>
                    Später erinnern
                </button>
            </div>
        </div>
    )
}
