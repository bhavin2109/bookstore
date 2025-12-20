import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp as verifyOtpAPI } from '../services/authServices';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a 6-digit OTP to <strong>{email}</strong>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
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
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive OTP?{' '}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
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