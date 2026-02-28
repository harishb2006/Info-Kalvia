import React, { useState } from 'react';

const Cards = ({ studentData, handleInputChange, handleSave, newApplication, handleNewAppChange, handleAddCourse, handleDeleteCourse }) => {
    // Independent edit states for each card
    const [editAccount, setEditAccount] = useState(false);
    const [editEducation, setEditEducation] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);

    const onSaveAccount = () => {
        handleSave();
        setEditAccount(false);
    };

    const onSaveEducation = () => {
        handleSave();
        setEditEducation(false);
    };

    const renderInput = (name, value, isEditing, type = "text", disabled = false) => {
        if (!isEditing) {
            return <div className="p-2 border border-transparent text-gray-800 font-medium">{value || <span className="text-gray-400">N/A</span>}</div>;
        }
        return (
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={handleInputChange}
                disabled={disabled}
                className={`w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
            />
        );
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">

            {/* 🟦 Card 1: Account / Basic Details (students) */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-500 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-gray-800">🟦 Account / Basic Details</h2>
                    {!editAccount ? (
                        <button onClick={() => setEditAccount(true)} className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-gray-700">Edit</button>
                    ) : (
                        <button onClick={onSaveAccount} className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow-sm flex items-center gap-1">
                            💾 Save Account Details
                        </button>
                    )}
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                        {renderInput('name', studentData.name, editAccount)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                        {renderInput('email', studentData.email, editAccount, 'email', true)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                        {renderInput('phone', studentData.phone, editAccount)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                        {renderInput('date_of_birth', studentData.date_of_birth, editAccount, 'date')}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">City</label>
                        {renderInput('city', studentData.city, editAccount)}
                    </div>
                </div>
            </div>

            {/* 🟪 Card 2: Educational Details (education_details) */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-purple-500 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-gray-800">🟪 Educational Details</h2>
                    {!editEducation ? (
                        <button onClick={() => setEditEducation(true)} className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-gray-700">Edit</button>
                    ) : (
                        <button onClick={onSaveEducation} className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold shadow-sm flex items-center gap-1">
                            💾 Save Education Details
                        </button>
                    )}
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">10th Board</label>
                        {renderInput('tenthBoard', studentData.tenthBoard, editEducation)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">10th Percentage (%)</label>
                        {renderInput('tenthScore', studentData.tenthScore, editEducation)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">12th Board</label>
                        {renderInput('twelfthBoard', studentData.twelfthBoard, editEducation)}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">12th Percentage (%)</label>
                        {renderInput('twelfthScore', studentData.twelfthScore, editEducation)}
                    </div>
                </div>
            </div>

            {/* 🟩 Card 3: Course Enrollment (List + Form) */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-green-500 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-800">🟩 Course Enrollment</h2>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                            {studentData.applications?.length || 0} Enrolled
                        </span>
                    </div>
                    {!showCourseForm ? (
                        <button onClick={() => setShowCourseForm(true)} className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-gray-700">
                            ➕ Add Course
                        </button>
                    ) : (
                        <button onClick={() => { handleAddCourse(); setShowCourseForm(false); }} className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold shadow-sm flex items-center gap-1">
                            💾 Save Course
                        </button>
                    )}
                </div>
                <div className="p-6">
                    {/* List of Enrolled Courses */}
                    <div className={showCourseForm ? "mb-6" : ""}>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide border-b pb-2">Currently Enrolled</h3>
                        {studentData.applications && studentData.applications.length > 0 ? (
                            <div className="space-y-3">
                                {studentData.applications.map((app, index) => (
                                    <div key={app.applicationId || index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{app.course}</h4>
                                            <p className="text-sm text-gray-500">Duration: {app.duration} {app.fee != null ? `| Fee: $${app.fee}` : ''}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0 flex gap-2 items-center">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    app.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {(app.status || 'submitted').replace('_', ' ')}
                                            </span>
                                            <button onClick={() => handleDeleteCourse(app.applicationId)} className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 rounded border border-red-100 hover:bg-red-100 transition-colors">
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-400 font-medium italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No courses enrolled yet.
                            </div>
                        )}
                    </div>

                    {/* Form for New Application */}
                    {showCourseForm && (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">New Enrollment</h3>
                                <button onClick={() => setShowCourseForm(false)} className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 bg-green-50/50 p-4 rounded-lg border border-green-100">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Course Title</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={newApplication?.course || ''}
                                        onChange={handleNewAppChange}
                                        className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-400 bg-white"
                                        placeholder="e.g. B.Tech Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Duration (Months)</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={newApplication?.duration || ''}
                                        onChange={handleNewAppChange}
                                        className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-400 bg-white"
                                        placeholder="e.g. 48"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Fee</label>
                                    <input
                                        type="number"
                                        name="fee"
                                        value={newApplication?.fee || ''}
                                        onChange={handleNewAppChange}
                                        className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-400 bg-white"
                                        placeholder="e.g. 1500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Application Status</label>
                                    <select
                                        name="status"
                                        value={newApplication?.status || 'submitted'}
                                        onChange={handleNewAppChange}
                                        className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-400 bg-white"
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Cards;
