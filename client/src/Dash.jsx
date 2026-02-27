import React, { useState } from 'react';

const KalviumAgentDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Defaulted to true so you can see the UI
  const [isAiTyping, setIsAiTyping] = useState(false);
  
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

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (Dark, Enterprise Feel) */}
      <aside className="w-[280px] bg-[#0F172A] text-white flex flex-col justify-between p-8">
        <div>
          <div className="text-2xl font-black tracking-tight text-white mb-12">
            Kalvium<span className="text-blue-500">Labs</span>
          </div>
          <div className="space-y-6 text-sm font-medium">
            <div className="text-blue-400 cursor-pointer">Profile Dashboard</div>
            <div className="text-slate-400 hover:text-white cursor-pointer transition-colors">My Courses</div>
            <div className="text-slate-400 hover:text-white cursor-pointer transition-colors">Settings</div>
          </div>
        </div>
        <button className="text-sm text-slate-400 hover:text-white text-left transition-colors">
          Log Out
        </button>
      </aside>

      {/* 2. MAIN DASHBOARD (Bento Grid) */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your personal and academic details</p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 max-w-5xl">
          
          {/* Personal Info - Span 8 */}
          <div className="col-span-8 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Personal Details</h2>
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Full Name</p>
                <p className="text-lg font-bold text-slate-900">{studentData.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Email Address</p>
                <p className="text-lg font-bold text-slate-900">{studentData.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                <p className="text-lg font-bold text-slate-900">{studentData.phone}</p>
              </div>
            </div>
          </div>

          {/* Academic Highlights - Span 4 */}
          <div className="col-span-4 bg-blue-600 p-8 rounded-[24px] shadow-lg text-white flex flex-col justify-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-6">Education Stats</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-blue-500 pb-2">
                <span className="text-sm text-blue-100">10th Score</span>
                <span className="text-2xl font-black">{studentData.tenthScore}</span>
              </div>
              <div className="flex justify-between items-end border-b border-blue-500 pb-2">
                <span className="text-sm text-blue-100">12th Score</span>
                <span className="text-2xl font-black">{studentData.twelfthScore}</span>
              </div>
            </div>
          </div>

          {/* Detailed Education - Span 6 */}
          <div className="col-span-6 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Board Information</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl transition-all duration-500 ${studentData.twelfthBoard === 'KSEAB' ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-50'}`}>
                <p className="text-sm text-slate-500">12th Board</p>
                <p className="text-lg font-bold text-slate-900">{studentData.twelfthBoard}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">10th Board</p>
                <p className="text-lg font-bold text-slate-900">{studentData.tenthBoard}</p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses - Span 6 */}
          <div className="col-span-6 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Enrolled Courses</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                  {studentData.status}
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-tight">{studentData.course}</p>
              <p className="text-sm text-slate-500 mt-2">Duration: {studentData.duration}</p>
            </div>
          </div>
        </div>

        {/* 3. AGENTIC CHATBOT INTERFACE */}
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform"
          >
            AI
          </button>
        ) : (
          <div className="fixed bottom-10 right-10 w-[400px] bg-white/90 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white overflow-hidden flex flex-col">
            
            {/* Agent Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-3">
                {/* Pulsing Status Dot */}
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Kalvium AI Agent</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Connected to SQLite</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
            </div>

            {/* Chat Body - High End Look */}
            <div className="h-[360px] p-6 overflow-y-auto flex flex-col gap-6 text-sm">
              
              {/* Agent System Message */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-4">System</span>
                <div className="bg-slate-50 border-l-2 border-slate-300 text-slate-700 p-4 rounded-r-2xl rounded-bl-2xl">
                  Authentication verified. I am ready to query or update your profile database. How can I assist?
                </div>
              </div>

              {/* User Message */}
              <div className="flex flex-col gap-1 self-end items-end w-3/4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mr-4">You</span>
                <div className="bg-blue-600 text-white p-4 rounded-l-2xl rounded-br-2xl shadow-sm text-right">
                  Update my 12th board from TN HSC to KSEAB.
                </div>
              </div>

              {/* Agent Execution Message (The "Agentic" Touch) */}
              <div className="flex flex-col gap-1 w-5/6">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider ml-4">Agent Execution</span>
                <div className="bg-blue-50 border-l-2 border-blue-500 text-slate-800 p-4 rounded-r-2xl rounded-bl-2xl">
                  <p className="font-bold text-blue-800 mb-2">Database Update Successful ✓</p>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs font-mono text-slate-600">
                    <span className="text-slate-400 line-through mr-2">TN HSC</span> 
                    <span className="text-green-600 font-bold">➔ KSEAB</span>
                  </div>
                  <p className="mt-3 text-slate-600">Your UI has been synced with the latest database state.</p>
                </div>
              </div>
            </div>

            {/* Action Chips */}
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200">What course am I in?</span>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200">Update 10th score</span>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 border-t border-slate-100">
              <div className="flex bg-slate-50 rounded-xl border border-slate-200 p-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input 
                  type="text" 
                  placeholder="Ask the database..." 
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-slate-800 focus:outline-none"
                />
                <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
                  Run
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default KalviumAgentDashboard;