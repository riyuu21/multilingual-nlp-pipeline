function LimitPopup({ onLogin, onDismiss, remaining }) {
    return (
        <div className="limit-overlay">
            <div className="limit-popup">
                <div className="limit-icon">⚡</div>
                <h2>You're on a roll!</h2>
                <p>You've used all your free analyses for today. Sign in to get more!</p>

                <div className="limit-features">
                    <div className="limit-feature">
                        <span>✓</span>
                        <span>100 analyses per day</span>
                    </div>
                    <div className="limit-feature">
                        <span>✓</span>
                        <span>History saved across devices</span>
                    </div>
                    <div className="limit-feature">
                        <span>✓</span>
                        <span>Model learns from your feedback</span>
                    </div>
                    <div className="limit-feature">
                        <span>✓</span>
                        <span>Priority support</span>
                    </div>
                </div>

                <button className="limit-login-btn" onClick={onLogin}>
                    Sign in with Google
                </button>
                <button className="limit-dismiss-btn" onClick={onDismiss}>
                    Maybe later
                </button>
            </div>
        </div>
    );
}

export default LimitPopup;