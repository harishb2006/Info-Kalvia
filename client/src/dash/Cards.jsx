import React from 'react';

const Cards = ({ studentData, isEditing, handleInputChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1: Personal Details (Dark Charcoal) */}
            <div className="bg-[#1C1C1E] p-8 rounded-[36px] shadow-sm text-white">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-medium text-slate-400">Personal Details</h2>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Updated 1 day ago</div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                        {isEditing ? (
                            <input type="text" name="name" value={studentData.name} onChange={handleInputChange} className="w-full bg-white/10 border-none rounded-xl p-2 text-white outline-none focus:ring-2 focus:ring-[#96F5A3]" />
                        ) : (
                            <p className="text-2xl font-semibold">{studentData.name}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Email</label>
                            {isEditing ? (
                                <input type="email" name="email" value={studentData.email} onChange={handleInputChange} className="w-full bg-white/10 border-none rounded-xl p-2 text-white outline-none focus:ring-2 focus:ring-[#96F5A3]" />
                            ) : (
                                <p className="text-sm font-medium">{studentData.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Phone</label>
                            {isEditing ? (
                                <input type="text" name="phone" value={studentData.phone} onChange={handleInputChange} className="w-full bg-white/10 border-none rounded-xl p-2 text-white outline-none focus:ring-2 focus:ring-[#96F5A3]" />
                            ) : (
                                <p className="text-sm font-medium">{studentData.phone}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Course Information (Pale Purple) */}
            <div className="bg-[#AEA1FF] p-8 rounded-[36px] shadow-sm flex flex-col text-[#1C1C1E]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-medium">Enrolled Course</h2>
                    <span className="px-3 py-1 bg-[#1C1C1E] text-[#AEA1FF] text-xs font-bold rounded-full">
                        {studentData.status}
                    </span>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                    {isEditing ? (
                        <input type="text" name="course" value={studentData.course} onChange={handleInputChange} className="w-full bg-white/40 border-none rounded-xl p-3 mb-2 text-[#1C1C1E] font-bold outline-none" />
                    ) : (
                        <p className="text-3xl font-bold leading-tight mb-2">{studentData.course}</p>
                    )}
                    {isEditing ? (
                        <input type="text" name="duration" value={studentData.duration} onChange={handleInputChange} className="w-1/2 bg-white/40 border-none rounded-xl p-2 text-[#1C1C1E] text-sm outline-none" />
                    ) : (
                        <p className="text-sm font-medium opacity-80">Duration: {studentData.duration}</p>
                    )}
                </div>
            </div>

            {/* Card 3: Board Information (White) */}
            <div className="bg-white p-8 rounded-[36px] shadow-sm text-[#1C1C1E]">
                <h2 className="text-sm font-medium text-slate-500 mb-8">Board Information</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <label className="text-sm font-medium text-slate-500">12th Board</label>
                        {isEditing ? (
                            <input type="text" name="twelfthBoard" value={studentData.twelfthBoard} onChange={handleInputChange} className="w-32 bg-slate-100 rounded-lg p-2 text-right font-bold outline-none" />
                        ) : (
                            <p className="text-xl font-bold">{studentData.twelfthBoard}</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <label className="text-sm font-medium text-slate-500">10th Board</label>
                        {isEditing ? (
                            <input type="text" name="tenthBoard" value={studentData.tenthBoard} onChange={handleInputChange} className="w-32 bg-slate-100 rounded-lg p-2 text-right font-bold outline-none" />
                        ) : (
                            <p className="text-xl font-bold">{studentData.tenthBoard}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Card 4: Education Stats (Mint Green) */}
            <div className="bg-[#96F5A3] p-8 rounded-[36px] shadow-sm text-[#1C1C1E] flex flex-col">
                <h2 className="text-sm font-medium mb-8">Academic Scores</h2>
                <div className="flex flex-col gap-6 justify-end flex-1">
                    <div>
                        <span className="text-sm font-medium opacity-80 block mb-1">10th Score</span>
                        {isEditing ? (
                            <input type="text" name="tenthScore" value={studentData.tenthScore} onChange={handleInputChange} className="w-full bg-white/40 border-none rounded-xl p-2 text-3xl font-bold outline-none" />
                        ) : (
                            <span className="text-4xl font-bold">{studentData.tenthScore}</span>
                        )}
                    </div>
                    <div>
                        <span className="text-sm font-medium opacity-80 block mb-1">12th Score</span>
                        {isEditing ? (
                            <input type="text" name="twelfthScore" value={studentData.twelfthScore} onChange={handleInputChange} className="w-full bg-white/40 border-none rounded-xl p-2 text-3xl font-bold outline-none" />
                        ) : (
                            <span className="text-4xl font-bold">{studentData.twelfthScore}</span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Cards;
