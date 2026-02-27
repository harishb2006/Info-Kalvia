import React, { useState } from 'react';
import Navbar from './dash/Navbar';
import Cards from './dash/Cards';
import Chatbot from './dash/Chatbot';

const KalviumAgentDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Real-time state mimicking the SQLite database
  const [studentData, setStudentData] = useState({
    name: "Harish B",
    email: "harish@example.com",
    phone: "+91 98765 43210",
    tenthBoard: "SSLC",
    tenthScore: "95%",
    twelfthBoard: "TN HSC",
    twelfthScore: "90%",
    course: "Software Product Engineering",
    duration: "4 Years",
    status: "Active"
  });

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#EFECE5] font-sans">

      {/* 1. TOP NAVIGATION */}
      <Navbar studentData={studentData} />

      {/* 2. MAIN DASHBOARD */}
      <main className="max-w-6xl mx-auto p-8 relative mt-4">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Overview</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${isEditing ? 'bg-[#96F5A3] text-[#1C1C1E]' : 'bg-white text-[#1C1C1E] shadow-sm'
              }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Manually'}
          </button>
        </header>

        {/* 4-Box Bento Grid with heavily rounded corners */}
        <Cards
          studentData={studentData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />

        {/* 3. AGENTIC CHATBOT INTERFACE */}
        <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </main>
    </div>
  );
};

export default KalviumAgentDashboard;