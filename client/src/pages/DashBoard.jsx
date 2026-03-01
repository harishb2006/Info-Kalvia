import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Cards from '../Components/Cards';
import Chatbot from '../Components/Chatbot';
import { studentService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const KalviumAgentDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    name: "", email: "", phone: "", city: "", date_of_birth: "",
    tenthBoard: "", tenthScore: "",
    twelfthBoard: "", twelfthScore: "",
    applications: []
  });

  const [newApplication, setNewApplication] = useState({
    course: "", duration: "", fee: "", status: "submitted"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }
        const res = await studentService.getProfile();
        const p = res.profile;
        setStudentData({
          name: p.name || "", email: p.email || "", phone: p.phone || "Not Provided",
          city: p.city || "Not Provided", date_of_birth: p.date_of_birth || "Not Provided",
          tenthBoard: p.tenthBoard || "N/A", tenthScore: p.tenthScore || "N/A",
          twelfthBoard: p.twelfthBoard || "N/A", twelfthScore: p.twelfthScore || "N/A",
          applications: p.applications || []
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        authService.logout();
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => setStudentData({ ...studentData, [e.target.name]: e.target.value });
  const handleNewAppChange = (e) => setNewApplication({ ...newApplication, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await studentService.updateProfile(studentData);
      const p = res.profile;
      setStudentData({
        ...studentData, ...p, applications: p.applications || []
      });
    } catch (err) { alert(err.message); }
  };

  const handleAddCourse = async () => {
    if (!newApplication.course) return alert("Course Title is required!");
    try {
      const res = await studentService.updateProfile({ ...studentData, newApplication });
      setStudentData({ ...studentData, applications: res.profile.applications || [] });
      setNewApplication({ course: "", duration: "", fee: "", status: "submitted" });
    } catch (err) { alert(err.message); }
  };

  const handleDeleteCourse = async (applicationId) => {
    if (!window.confirm("Delete this course application?")) return;
    try {
      const res = await studentService.deleteApplication(applicationId);
      setStudentData({ ...studentData, applications: res.profile.applications || [] });
    } catch (err) { alert(err.message); }
  };

  return (
    // STRICTLY NO SCROLL on the main wrapper
    <div className="h-screen w-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
      
      <div className="shrink-0">
        <Navbar studentData={studentData} />
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 flex gap-6 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: Fixed layout, NO scroll */}
        <div className="flex-1 flex flex-col min-h-0 pr-2">
          <header className="mb-4 shrink-0">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Profile Overview</h1>
          </header>

          {/* Cards Wrapper takes exactly the remaining height */}
          <div className="flex-1 min-h-0 w-full">
            <Cards
              studentData={studentData}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              newApplication={newApplication}
              handleNewAppChange={handleNewAppChange}
              handleAddCourse={handleAddCourse}
              handleDeleteCourse={handleDeleteCourse}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Chatbot */}
        {isChatOpen && (
          <div className="transition-all duration-300 ease-in-out shrink-0 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-[400px]">
            <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} setStudentContextData={setStudentData} />
          </div>
        )}
      </main>

      {/* Chatbot toggle button when closed */}
      {!isChatOpen && (
        <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} setStudentContextData={setStudentData} />
      )}
    </div>
  );
};

export default KalviumAgentDashboard;