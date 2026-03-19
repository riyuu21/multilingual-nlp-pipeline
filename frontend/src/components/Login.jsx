import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

function Login({ onLogin }) {
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
            <h1>Multilingual NLP Analyzer</h1>
            <p>Sign in to get personalized sentiment and language detection</p>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => alert("Login failed, try again")}
            />
        </div>
    )
}

export default Login