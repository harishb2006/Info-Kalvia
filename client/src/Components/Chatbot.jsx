import React, { useState, useRef, useEffect } from 'react';

const Chatbot = ({ isChatOpen, setIsChatOpen, setStudentContextData }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm your AI Profile Assistant. How can I help you manage your student profile?" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingActionInfo, setPendingActionInfo] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg = { sender: 'user', text: inputText };
        setMessages((prev) => [...prev, userMsg]);
        setInputText("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/students/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg.text }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to communicate with agent.");
            }

            const data = await response.json();

            setMessages((prev) => [...prev, {
                sender: 'bot',
                text: data.reply,
                confirmation: data.confirmation || null
            }]);

            if (data.confirmation && data.pendingAction) {
                setPendingActionInfo(data.pendingAction);
            }

            // If the agent updated the profile, pass the updated profile up the component tree to reflect real-time UI changes
            if (data.updatedProfile && setStudentContextData) {
                setStudentContextData(data.updatedProfile);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I encountered an error answering your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSend = async (action, index) => {
        setIsLoading(true);
        // Remove buttons from the specific message immediately to prevent double-clicks
        setMessages(prev => prev.map((msg, i) => {
            if (i === index) {
                return { ...msg, confirmation: null }; // Clear confirmation block
            }
            return msg;
        }));

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/students/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ action: action, pendingAction: pendingActionInfo }),
            });

            if (!response.ok) {
                throw new Error("Action failed.");
            }

            const data = await response.json();

            setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
            setPendingActionInfo(null); // Clear pending action state

            if (data.updatedProfile && setStudentContextData) {
                setStudentContextData(data.updatedProfile);
            }

        } catch (error) {
            console.error("Action error:", error);
            setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I encountered an error processing your confirmation." }]);
            setPendingActionInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading && !pendingActionInfo) {
            handleSendMessage();
        }
    };

    if (!isChatOpen) {
        return (
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform z-50"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </button>
        );
    }

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">

            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-black text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AI Assistant</h3>
                        <p className="text-xs text-slate-300">Powered by LLaMa 3</p>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-300 hover:text-white font-bold p-1 rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}>
                        <div
                            className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm w-fit max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border text-slate-700 rounded-bl-sm border-slate-200'}`}
                            style={{ wordBreak: 'break-word' }}
                            dangerouslySetInnerHTML={{ __html: msg.text ? msg.text.replace(/\n/g, '<br />') : '' }}
                        />

                        {/* Render Confirmation Box if present */}
                        {msg.confirmation && (
                            <div className="mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-full max-w-[90%]">
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{msg.confirmation.title}</h4>
                                <p className="text-xs text-slate-600 mb-3">{msg.confirmation.description}</p>
                                <div className="flex gap-2">
                                    {msg.confirmation.buttons.map(btn => (
                                        <button
                                            key={btn.action}
                                            onClick={() => handleActionSend(btn.action, idx)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${btn.style === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' :
                                                    btn.style === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                                                        'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                                }`}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {msg.sender === 'bot' && idx === messages.length - 1 && dataWasUpdated(msg.text) && (
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider ml-1 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Database Updated Contextually
                            </span>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex flex-col gap-1 items-start w-5/6">
                        <div className="bg-white border text-slate-500 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className={`flex bg-slate-100 rounded-full p-1.5 transition-all shadow-inner ${pendingActionInfo ? 'opacity-50 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-indigo-500'}`}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={pendingActionInfo ? "Please confirm or cancel above..." : "Type a message..."}
                        disabled={isLoading || pendingActionInfo !== null}
                        className="flex-1 bg-transparent border-none px-4 py-2 text-[15px] text-slate-800 focus:outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim() || pendingActionInfo !== null}
                        className="bg-indigo-600 text-white p-2.5 w-11 h-11 rounded-full text-sm font-bold shadow-md flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-slate-400">Agent has direct securely typed access to your data profile.</p>
                </div>
            </div>

        </div>
    );
};

// Simple heuristic to see if the bot text means it updated standard data.
const dataWasUpdated = (text) => {
    if (!text) return false;
    const t = text.toLowerCase();
    return (t.includes("update") || t.includes("delete")) && (t.includes("success") || t.includes("completed") || t.includes("new state") || t.includes("done"));
}

export default Chatbot;
