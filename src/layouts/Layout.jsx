import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import PropTypes from 'prop-types';
import { MessageSquare, X } from 'lucide-react';
import { getAiResponse } from '../services/aiService';

const Layout = ({ children }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your prediction assistant. Do you need help analyzing a particular region's risk data?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (chatOpen) {
            scrollToBottom();
        }
    }, [messages, chatOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        const aiResponseContent = await getAiResponse(inputValue, messages);
        
        setMessages(prev => [...prev, { role: 'ai', content: aiResponseContent }]);
        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-200 flex flex-col relative w-full overflow-hidden">
            {/* Interactive Spotlight Cursor Highlight */}
            <div 
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-75 mix-blend-screen"
                style={{ background: 'radial-gradient(500px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(16, 185, 129, 0.15), transparent 40%)' }}
            ></div>
            
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {children}
            </main>
            <footer className="mt-auto py-6 border-t border-white/10 relative z-10 glass-panel mx-4 mb-4 !rounded-xl !bg-slate-900/40">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm flex items-center justify-center gap-2 font-medium">
                    &copy; {new Date().getFullYear()} <span className="text-emerald-400">LandslideWatch AI System.</span> Authorized Personnel Only.
                </div>
            </footer>

            {/* Chatbot FAB */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
                {chatOpen && (
                    <div className="mb-4 w-80 bg-slate-800 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden glass-panel slide-up">
                        <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-bold">AI Assistant</span>
                            </div>
                            <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto bg-slate-900/60 text-sm space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                                        {msg.role === 'user' ? 'U' : 'AI'}
                                    </div>
                                    <div className={`p-3 text-slate-200 shadow-sm leading-relaxed max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600/80 border border-indigo-500 rounded-lg rounded-tr-none' : 'bg-slate-700/80 border border-slate-600 rounded-lg rounded-tl-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2 items-center text-slate-500 pl-10 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-200"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-300"></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-3 border-t border-slate-700 bg-slate-800">
                            <input 
                                type="text" 
                                placeholder="Ask a question..." 
                                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                            />
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => setChatOpen(!chatOpen)}
                    className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover-scale glow-effect relative"
                >
                    {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                    {!chatOpen && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full"></span>}
                </button>
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
