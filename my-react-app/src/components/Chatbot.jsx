import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm Rajan's AI assistant. I'm running locally in your browser (100% free & private). How can I help you explore Rajan's work today?" }
    ]);
    const [input, setInput] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [statusText, setStatusText] = useState('Initializing AI...');
    const [isFallback, setIsFallback] = useState(false);
    
    const worker = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    useEffect(() => {
        if (!worker.current) {
            // Create the worker
            worker.current = new Worker(new URL('../worker.js', import.meta.url), {
                type: 'module'
            });

            // Handle messages from the worker
            const onMessageReceived = (e) => {
                const { status, file, progress, output } = e.data;

                if (status === 'initiate') {
                    setStatusText(`Loading model: ${file}...`);
                } else if (status === 'progress') {
                    setProgress(progress);
                } else if (status === 'ready') {
                    setIsReady(true);
                    setStatusText('AI is ready!');
                } else if (status === 'complete') {
                    setIsGenerating(false);
                    const botResponse = output[0].generated_text[output[0].generated_text.length - 1].content;
                    setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
                }
            };

            worker.current.addEventListener('message', onMessageReceived);

            // Trigger background loading
            worker.current.postMessage({ type: 'init' });

            // 5-second timeout to switch to fallback mode if stuck
            const timer = setTimeout(() => {
                if (!isReady) {
                    setIsFallback(true);
                    setIsReady(true); // Treat as ready in fallback mode
                    setStatusText('Running in Lightweight Mode');
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isReady]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isGenerating || !isReady) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsGenerating(true);

        if (isFallback) {
            // Simple rule-based fallback responses
            setTimeout(() => {
                let response = "I'm currently running in lightweight mode. I'm an expert in AI, ML, and Python. You can check my Demo section for a secure financial dashboard!";
                const lowInput = input.toLowerCase();
                if (lowInput.includes('contact') || lowInput.includes('email')) response = "You can reach Rajan at rajankhadka.dev@gmail.com or via the Contact form below.";
                if (lowInput.includes('skill') || lowInput.includes('tech')) response = "Rajan specializes in Python, Machine Learning, React, and AI automation.";
                
                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsGenerating(false);
            }, 1000);
            return;
        }

        // Send messages to worker for generation
        const conversation = [...messages, userMessage];
        worker.current.postMessage({
            messages: conversation
        });
    };

    return (
        <div className="chatbot-container">
            {/* FAB */}
            <button 
                className="chatbot-fab" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Rajan's Assistant <span style={{fontSize: '0.7rem', opacity: 0.6}}>(Local AI)</span></h3>
                        <X 
                            size={20} 
                            style={{cursor: 'pointer', opacity: 0.5}} 
                            onClick={() => setIsOpen(false)} 
                        />
                    </div>

                    <div className="chatbot-messages">
                        {!isReady && (
                            <div className="loading-container">
                                <Loader2 className="animate-spin" size={40} color="#6366f1" />
                                <p>{statusText}</p>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p style={{fontSize: '0.8rem', opacity: 0.6}}>First load optimized: Downloading ~135M parameters (quantized) to browser cache.</p>
                            </div>
                        )}

                        {isReady && messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}

                        {isGenerating && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            className="chatbot-input" 
                            placeholder={isReady ? "Type a message..." : "Loading AI..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={!isReady || isGenerating}
                        />
                        <button 
                            type="submit" 
                            className="chatbot-send" 
                            disabled={!isReady || isGenerating || !input.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
