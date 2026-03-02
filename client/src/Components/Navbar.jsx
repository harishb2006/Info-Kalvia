import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = ({ studentData }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout API fails, redirect to login
            navigate('/login');
        }
    };

    return (
        <nav className="bg-[#1C1C1E] text-white px-8 py-4 flex justify-between items-center rounded-b-xl mx-2 shadow-sm">
            <div className="text-xl font-bold tracking-tight">
                Info-kalvia
            </div>
            <div className="text-sm font-medium absolute left-1/2 -translate-x-1/2 hidden md:block">
                Student Profile
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                    Logout
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {/* Fallback avatar if image fails */}
                    <span className="text-white">{studentData.name.charAt(0)}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
