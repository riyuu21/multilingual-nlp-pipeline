function SkeletonCards() {
    return (
        <div className="results-grid">
            {[1, 2, 3].map((i) => (
                <div key={i} className="card skeleton-card">
                    <div className="skeleton skeleton-label" />
                    <div className="skeleton skeleton-value" />
                    <div className="skeleton skeleton-small" />
                    <div className="skeleton skeleton-feedback" />
                </div>
            ))}
        </div>
    );
}

export default SkeletonCards;