import React, { useState, useEffect } from 'react';
import Navbar from '../dash/Navbar';
import Cards from '../dash/Cards';
import Chatbot from '../dash/Chatbot';
import { studentService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const KalviumAgentDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const navigate = useNavigate();

  // Real-time state mimicking the SQLite database
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
        // Fallback for null values to avoid passing null directly
        const p = res.profile;
        setStudentData({
          name: p.name || "",
          email: p.email || "",
          phone: p.phone || "Not Provided",
          city: p.city || "Not Provided",
          date_of_birth: p.date_of_birth || "Not Provided",
          tenthBoard: p.tenthBoard || "N/A",
          tenthScore: p.tenthScore || "N/A",
          twelfthBoard: p.twelfthBoard || "N/A",
          twelfthScore: p.twelfthScore || "N/A",
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

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleNewAppChange = (e) => {
    setNewApplication({ ...newApplication, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await studentService.updateProfile(studentData);
      const p = res.profile;
      setStudentData({
        name: p.name || "",
        email: p.email || "",
        phone: p.phone || "Not Provided",
        city: p.city || "Not Provided",
        date_of_birth: p.date_of_birth || "Not Provided",
        tenthBoard: p.tenthBoard || "N/A",
        tenthScore: p.tenthScore || "N/A",
        twelfthBoard: p.twelfthBoard || "N/A",
        twelfthScore: p.twelfthScore || "N/A",
        applications: p.applications || []
      });
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(err.message);
    }
  };

  const handleAddCourse = async () => {
    if (!newApplication.course) return alert("Course Title is required!");
    try {
      const res = await studentService.updateProfile({ ...studentData, newApplication });
      const p = res.profile;
      setStudentData({
        ...studentData,
        applications: p.applications || []
      });
      // clear the form
      setNewApplication({ course: "", duration: "", fee: "", status: "submitted" });
    } catch (err) {
      console.error("Failed to add course", err);
      alert(err.message);
    }
  };

  const handleDeleteCourse = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this course application?")) return;
    try {
      const res = await studentService.deleteApplication(applicationId);
      const p = res.profile;
      setStudentData({
        ...studentData,
        applications: p.applications || []
      });
    } catch (err) {
      console.error("Failed to delete application", err);
      alert(err.message);
    }
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
        </header>

        {/* 4-Card Multi-Layout */}
        <Cards
          studentData={studentData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          newApplication={newApplication}
          handleNewAppChange={handleNewAppChange}
          handleAddCourse={handleAddCourse}
          handleDeleteCourse={handleDeleteCourse}
        />

        {/* 3. AGENTIC CHATBOT INTERFACE */}
        <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </main>
    </div>
  );
};

export default KalviumAgentDashboard;