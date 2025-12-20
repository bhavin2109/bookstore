import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp as verifyOtpAPI } from '../services/authServices';
import '../index.css';

function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get email from localStorage
        const registerEmail = localStorage.getItem('registerEmail');
        if (!registerEmail) {
            // If no email found, redirect to register
            navigate('/register');
        } else {
            setEmail(registerEmail);
        }
    }, [navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await verifyOtpAPI({ email, otp });
            
            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            // Clear register email
            localStorage.removeItem('registerEmail');
            
            alert("OTP verified successfully! You are now registered.");
            navigate('/home');
        } catch (error) {
            console.log("Verification Error: ", error);
            setError(error.message || error.error || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        // Redirect back to register to resend OTP
        navigate('/register');
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <div>
                    <h2 className="form-title">
                        Verify OTP
                    </h2>
                    <p className="form-subtitle">
                        We've sent a 6-digit OTP to <strong>{email}</strong>
                    </p>
                </div>
                <form className="form" onSubmit={handleVerifyOtp}>
                    {error && (
                        <div className="error-message" role="alert">
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="otp" className="sr-only">OTP</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength="6"
                            required
                            className="form-input form-input-single"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(value);
                                setError('');
                            }}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="form-button"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>

                    <div className="form-link">
                        <p>
                            Didn't receive OTP?{' '}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;