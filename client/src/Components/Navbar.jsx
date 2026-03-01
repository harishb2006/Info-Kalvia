import React from 'react';

const Navbar = ({ studentData }) => {
    return (
        <nav className="bg-[#1C1C1E] text-white px-8 py-4 flex justify-between items-center rounded-b-xl mx-2 shadow-sm">
            <div className="text-xl font-bold tracking-tight">
                KalviumLabs
            </div>
            <div className="text-sm font-medium absolute left-1/2 -translate-x-1/2 hidden md:block">
                Student Profile
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-300">Logout</span>
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {/* Fallback avatar if image fails */}
                    <span className="text-white">{studentData.name.charAt(0)}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
