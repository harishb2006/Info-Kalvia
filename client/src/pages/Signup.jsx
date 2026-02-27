import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import login_img from '../assets/Login_students.svg';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        // In a real app, you would validate and create the user here.
        navigate('/dash');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
            {/* Left Side: Illustration Container */}
            <div className="w-full lg:w-1/2 bg-beige flex items-center justify-center p-8 lg:p-0">
                <div className="w-full max-w-2xl flex items-center justify-center">
                    {/* Container styled to match reference layout */}
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                        <img src={login_img} alt="login_img" className='w-full h-auto' />
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 relative">
                <div className="absolute top-8 right-8 text-sm">
                    <span className="text-slate-500">Already have an account? </span>
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Log in
                    </Link>
                </div>

                <div className="w-full max-w-md flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-black mb-6">Sign Up</h1>

                    <p className="text-slate-600 text-sm text-center mb-10 max-w-[280px] leading-relaxed">
                        Create an account to access the learning platform
                    </p>

                    <form onSubmit={handleSignup} className="w-full space-y-5 flex flex-col items-center">
                        <div className="w-full">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-8 py-4 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your student Email"
                                required
                                className="w-full px-8 py-4 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a Password"
                                required
                                className="w-full px-8 py-4 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your Password"
                                required
                                className="w-full px-8 py-4 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 px-12 py-3 bg-primary text-white rounded-full font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer w-full"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
