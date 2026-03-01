import React, { useState } from 'react';

const Cards = ({ studentData, handleInputChange, handleSave, newApplication, handleNewAppChange, handleAddCourse, handleDeleteCourse }) => {
    const [editAccount, setEditAccount] = useState(false);
    const [editEducation, setEditEducation] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);

    const onSaveAccount = () => { handleSave(); setEditAccount(false); };
    const onSaveEducation = () => { handleSave(); setEditEducation(false); };

    const renderInput = (name, value, isEditing, type = "text", disabled = false) => {
        if (!isEditing) {
            return <div className="text-slate-800 font-medium py-1.5 text-sm md:text-base">{value || <span className="text-slate-400 italic text-sm">N/A</span>}</div>;
        }
        return (
            <input
                type={type} name={name} value={value || ''} onChange={handleInputChange} disabled={disabled}
                className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-white border-slate-300 shadow-sm'}`}
            />
        );
    };

    return (
        // Changed to flex-col so the top row wraps tightly and the bottom row stretches to fill
        <div className="flex flex-col gap-6 h-full w-full pb-2">

            {/* === TOP ROW === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                
                {/* 👤 Account Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-indigo-500">👤</span> Account Details
                        </h2>
                        {!editAccount ? (
                            <button onClick={() => setEditAccount(true)} className="text-sm px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 shadow-sm transition-colors">Edit</button>
                        ) : (
                            <button onClick={onSaveAccount} className="text-sm px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors">💾 Save</button>
                        )}
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                            {renderInput('name', studentData.name, editAccount)}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                            {renderInput('email', studentData.email, editAccount, 'email', true)}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                            {renderInput('phone', studentData.phone, editAccount)}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                            {renderInput('date_of_birth', studentData.date_of_birth, editAccount, 'date')}
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label>
                            {renderInput('city', studentData.city, editAccount)}
                        </div>
                    </div>
                </div>

                {/* 🎓 Educational Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-indigo-500">🎓</span> Educational Details
                        </h2>
                        {!editEducation ? (
                            <button onClick={() => setEditEducation(true)} className="text-sm px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 shadow-sm transition-colors">Edit</button>
                        ) : (
                            <button onClick={onSaveEducation} className="text-sm px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors">💾 Save</button>
                        )}
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">10th Board</label>
                            {renderInput('tenthBoard', studentData.tenthBoard, editEducation)}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">10th Percentage</label>
                            {/* Removed the hardcoded % here to fix the double %% glitch */}
                            {renderInput('tenthScore', studentData.tenthScore, editEducation)}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">12th Board</label>
                            {renderInput('twelfthBoard', studentData.twelfthBoard, editEducation)}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">12th Percentage</label>
                            {/* Removed the hardcoded % here to fix the double %% glitch */}
                            {renderInput('twelfthScore', studentData.twelfthScore, editEducation)}
                        </div>
                    </div>
                </div>
            </div>

            {/* === BOTTOM ROW === */}
            {/* 📚 Course Enrollment (Stretches to fill remaining space) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden relative">
                
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0 z-10 relative">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-indigo-500">📚</span> Enrollments
                        </h2>
                        <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold uppercase tracking-wider">
                            {studentData.applications?.length || 0} Total
                        </span>
                    </div>
                    {!showCourseForm ? (
                        <button onClick={() => setShowCourseForm(true)} className="text-sm px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2">
                            ➕ Add Course
                        </button>
                    ) : (
                        <button onClick={() => { handleAddCourse(); setShowCourseForm(false); }} className="text-sm px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2">
                            💾 Save Course
                        </button>
                    )}
                </div>
                
                {/* Content Area (Scrollable if needed, styled background to avoid feeling empty) */}
                {/* Added a subtle radial gradient so the empty space looks intentional and designed */}
                <div className="p-5 flex-1 overflow-y-auto bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-white">
                    {!showCourseForm ? (
                        studentData.applications && studentData.applications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {studentData.applications.map((app, index) => (
                                    <div key={app.applicationId || index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div>
                                            <h4 className="font-bold text-base text-slate-800">{app.course}</h4>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium bg-slate-50 inline-flex px-2 py-1 rounded-md">
                                                <span>⏱ {app.duration} Months</span>
                                                {app.fee != null && (
                                                    <><span className="w-1 h-1 rounded-full bg-slate-300"></span><span>💰 ${app.fee}</span></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-end">
                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider ${
                                                app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                app.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                app.status === 'under_review' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                                {(app.status || 'submitted').replace('_', ' ')}
                                            </span>
                                            <button onClick={() => handleDeleteCourse(app.applicationId)} className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center bg-white/80 rounded-xl border border-dashed border-slate-300 backdrop-blur-sm">
                                <span className="text-4xl mb-3 opacity-50">📂</span>
                                <h3 className="text-slate-600 font-bold text-base mb-1">No Enrollments Found</h3>
                                <p className="text-slate-400 text-sm">Click the "Add Course" button above to get started.</p>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative z-10">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Course Title</label>
                                <input type="text" name="course" value={newApplication?.course || ''} onChange={handleNewAppChange} className="w-full px-3 py-2 text-sm border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 rounded-lg outline-none transition-all" placeholder="B.Tech CS" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Duration (Mo)</label>
                                <input type="number" name="duration" value={newApplication?.duration || ''} onChange={handleNewAppChange} className="w-full px-3 py-2 text-sm border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 rounded-lg outline-none transition-all" placeholder="48" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Fee ($)</label>
                                <input type="number" name="fee" value={newApplication?.fee || ''} onChange={handleNewAppChange} className="w-full px-3 py-2 text-sm border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 rounded-lg outline-none transition-all" placeholder="1500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                                <select name="status" value={newApplication?.status || 'submitted'} onChange={handleNewAppChange} className="w-full px-3 py-2 text-sm border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 rounded-lg outline-none transition-all bg-white">
                                    <option value="submitted">Submitted</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cards;