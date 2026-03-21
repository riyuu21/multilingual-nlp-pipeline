function InfoSidebar({ onClose }) {
    const [activeTab, setActiveTab] = useState("manual");

    return (
        <div className="history-overlay">
            <div className="history-panel">
                <div className="history-header">
                    <div className="sidebar-tabs">
                        <button
                            className={`sidebar-tab ${activeTab === "manual" ? "active" : ""}`}
                            onClick={() => setActiveTab("manual")}
                        >
                            User Manual
                        </button>
                        <button
                            className={`sidebar-tab ${activeTab === "about" ? "active" : ""}`}
                            onClick={() => setActiveTab("about")}
                        >
                            About Me
                        </button>
                    </div>
                    <button className="history-close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="history-list">
                    {activeTab === "manual" && (
                        <div className="manual-content">
                            <div className="manual-section">
                                <h3>What is this app?</h3>
                                <p>Multilingual NLP Analyzer is an AI powered tool that detects the language of any text, translates it to your chosen language, and analyzes its sentiment — all in one place.</p>
                            </div>

                            <div className="manual-section">
                                <h3>What is Language Detection?</h3>
                                <p>The app automatically identifies what language your text is written in. It supports 60+ languages including Hindi, Spanish, French, Arabic and more. You can also manually select a language if you already know it.</p>
                            </div>

                            <div className="manual-section">
                                <h3>What is Confidence?</h3>
                                <p>Confidence is how sure the model is about its prediction. A score of 95% means the model is very certain. A lower score like 60% means the result might not be accurate — consider double checking.</p>
                            </div>

                            <div className="manual-section">
                                <h3>What is Sentiment?</h3>
                                <p>Sentiment tells you the emotional tone of the text. It can be:</p>
                                <ul className="manual-list">
                                    <li><span className="positive">POSITIVE</span> — happy, appreciative, or good tone</li>
                                    <li><span className="negative">NEGATIVE</span> — sad, angry, or critical tone</li>
                                    <li><span className="neutral">NEUTRAL</span> — factual or no strong emotion</li>
                                </ul>
                            </div>

                            <div className="manual-section">
                                <h3>What is Hinglish?</h3>
                                <p>Hinglish is a mix of Hindi written in Roman (English) script. For example "yaar kya kar raha hai" is Hinglish. Select Hinglish as source language for best results with such text.</p>
                            </div>

                            <div className="manual-section">
                                <h3>What are Feedback Buttons?</h3>
                                <p>The thumbs up and thumbs down buttons let you tell the model if it got the result right or wrong. Over time the model learns from your corrections and improves for you personally.</p>
                            </div>

                            <div className="manual-section">
                                <h3>Free vs Signed In</h3>
                                <ul className="manual-list">
                                    <li>Guest users get <strong>15 free analyses per day</strong></li>
                                    <li>Signed in users get <strong>100 analyses per day</strong></li>
                                    <li>Signed in users get <strong>history saved across devices</strong></li>
                                    <li>Signed in users get <strong>personal adaptive learning</strong></li>
                                </ul>
                            </div>

                            <div className="manual-section">
                                <h3>Keyboard Shortcuts</h3>
                                <ul className="manual-list">
                                    <li><kbd>Ctrl + Enter</kbd> — Analyze text</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="about-content">
                            <div className="about-avatar">
                                <div className="about-avatar-circle">R</div>
                            </div>
                            <h2 className="about-name">Riyansh</h2>
                            <p className="about-bio">Built this project to make multilingual text analysis accessible to everyone. Passionate about AI, NLP and building things that actually work.</p>

                            <div className="about-links">
                                <a href="https://github.com/riyuu21" target="_blank" rel="noreferrer" className="about-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                    GitHub
                                </a>

                                <a href="https://www.instagram.com/_.riy.ansh._" target="_blank" rel="noreferrer" className="about-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                    </svg>
                                    Instagram
                                </a>

                                <a href="https://www.linkedin.com/in/riyansh-sharma/" target="_blank" rel="noreferrer" className="about-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
export default InfoSidebar;