import React from 'react';

const Chatbot = ({ isChatOpen, setIsChatOpen }) => {
    if (!isChatOpen) {
        return (
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-10 right-10 w-16 h-16 bg-[#1C1C1E] text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform"
            >
                AI
            </button>
        );
    }

    return (
        <div className="fixed bottom-10 right-10 w-[380px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-50">

            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#96F5A3] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#52D165]"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1C1C1E] text-sm">Profile Assistant</h3>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-800 font-bold p-1">✕</button>
            </div>

            <div className="h-[320px] p-5 overflow-y-auto flex flex-col gap-5 text-sm bg-[#EFECE5]/30">

                <div className="flex flex-col gap-1 w-5/6">
                    <div className="bg-white border border-slate-100 text-slate-600 p-4 rounded-3xl rounded-tl-sm shadow-sm">
                        I'm connected to your SQLite database. How can I help you update your profile?
                    </div>
                </div>

                <div className="flex flex-col gap-1 self-end items-end w-5/6">
                    <div className="bg-[#1C1C1E] text-white p-4 rounded-3xl rounded-tr-sm shadow-sm text-left">
                        Update my 12th board from TN HSC to KSEAB.
                    </div>
                </div>

                <div className="flex flex-col gap-1 w-5/6">
                    <span className="text-[10px] font-bold text-[#52D165] uppercase tracking-wider ml-2 flex items-center gap-1">
                        Database Updated
                    </span>
                    <div className="bg-white border border-slate-100 text-slate-600 p-4 rounded-3xl rounded-tl-sm shadow-sm">
                        I have successfully updated your 12th board from <span className="line-through text-slate-400">TN HSC</span> to <b className="text-[#1C1C1E]">KSEAB</b>.
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex bg-[#EFECE5] rounded-full p-1 focus-within:ring-2 focus-within:ring-[#AEA1FF] transition-all">
                    <input
                        type="text"
                        placeholder="Ask the database..."
                        className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    />
                    <button className="bg-[#1C1C1E] text-white p-2 w-10 h-10 rounded-full text-sm font-bold shadow-sm flex items-center justify-center hover:bg-slate-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Chatbot;
