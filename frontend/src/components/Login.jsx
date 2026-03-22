import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

function Login({ onLogin, onSkip }) {
    const handleSuccess = (response) => {
        const user = jwtDecode(response.credential)
        onLogin({
            id: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture
        })
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
                    </svg>
                    <h1>Aethrix</h1>
                </div>
                <p className="login-subtitle">Powered by AI — supports 60+ languages</p>

                <div className="login-features">
                    <div className="login-feature">
                        <span>✓</span>
                        <span>Free — 15 analyses per day</span>
                    </div>
                    <div className="login-feature">
                        <span>✓</span>
                        <span>Sign in for 100/day + history + adaptive learning</span>
                    </div>
                </div>

                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => alert("Login failed, try again")}
                />
                {onSkip && (
                    <button className="skip-btn" onClick={onSkip}>
                        Continue as guest
                    </button>
                )}
            </div>
        </div>
    )
}

export default Login