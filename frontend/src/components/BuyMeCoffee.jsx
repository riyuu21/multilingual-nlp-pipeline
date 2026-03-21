import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const UPI_ID = "2004kshitij@okaxis";
const UPI_NAME = "Kshitij Verma";
const UPI_URL = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;

function BuyMeCoffee({ onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bmc-overlay" onClick={onClose}>
            <div className="bmc-popup" onClick={(e) => e.stopPropagation()}>
                <button className="bmc-close" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                </button>

                <div className="bmc-header">
                    <span className="bmc-emoji">☕</span>
                    <h2>Buy me a coffee</h2>
                    <p>If you find this useful, consider supporting!</p>
                </div>

                <div className="bmc-qr">
                    <QRCodeSVG
                        value={UPI_URL}
                        size={200}
                        bgColor="transparent"
                        fgColor="#ffffff"
                        level="H"
                    />
                    <p className="bmc-scan-text">Scan with any UPI app</p>
                </div>

                <div className="bmc-upi-row">
                    <span className="bmc-upi-id">{UPI_ID}</span>
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>

                <a href={UPI_URL} className="bmc-pay-btn">
                    Pay with UPI App
                </a>
            </div>
        </div>
    );
}

export default BuyMeCoffee;