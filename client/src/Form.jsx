import React, { useState } from 'react';

const InteractiveProfileForm = () => {
  // State for toggling modes and handling async saving
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    fullName: "Harish B",
    email: "harish@example.com",
    phone: "+91 98765 43210",
    tenthBoard: "SSLC",
    twelfthBoard: "TN HSC",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate Database API Call
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate a 1.5 second backend delay
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-10 font-sans">
      
      {/* The Profile Card */}
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-sm border border-slate-200 overflow-hidden transition-all duration-500">
        
        {/* Card Header */}
        <div className="bg-[#0F172A] p-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Personal Profile</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your LMS identity and academic records.</p>
          </div>
          
          {/* Toggle Button */}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Card Body - The Form */}
        <form onSubmit={handleSave} className="p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Input Group: Full Name */}
            <div className="col-span-2 sm:col-span-1 group">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${isEditing ? 'text-blue-500' : 'text-slate-400'}`}>
                Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  required
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 py-2 border-b border-transparent">{formData.fullName}</p>
              )}
            </div>

            {/* Input Group: Email */}
            <div className="col-span-2 sm:col-span-1 group">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${isEditing ? 'text-blue-500' : 'text-slate-400'}`}>
                Email Address
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  required
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 py-2 border-b border-transparent">{formData.email}</p>
              )}
            </div>

            {/* Input Group: Phone */}
            <div className="col-span-2 sm:col-span-1 group">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${isEditing ? 'text-blue-500' : 'text-slate-400'}`}>
                Phone Number
              </label>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 py-2 border-b border-transparent">{formData.phone}</p>
              )}
            </div>

            {/* Input Group: 12th Board */}
            <div className="col-span-2 sm:col-span-1 group">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${isEditing ? 'text-blue-500' : 'text-slate-400'}`}>
                12th Board
              </label>
              {isEditing ? (
                <select 
                  name="twelfthBoard"
                  value={formData.twelfthBoard} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="TN HSC">TN HSC</option>
                  <option value="KSEAB">KSEAB</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                </select>
              ) : (
                <p className="text-lg font-bold text-slate-900 py-2 border-b border-transparent">{formData.twelfthBoard}</p>
              )}
            </div>
          </div>

          {/* Form Actions (Only visible in Edit Mode) */}
          {isEditing && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-4 animate-fade-in">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md disabled:bg-slate-400 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    Saving to Database...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};

export default InteractiveProfileForm;