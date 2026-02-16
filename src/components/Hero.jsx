import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Button from './Button';
import { useToast } from '../context/ToastContext';

const AI_SEARCH_WEBHOOK = 'https://n8n.srv954053.hstgr.cloud/webhook/supriya-search-ai';

export default function Hero() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading) return;

    setQuery('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmedQuery }]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(AI_SEARCH_WEBHOOK, { query: trimmedQuery }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
      });
      const raw = typeof data === 'string' ? data : (data?.output ?? data?.response ?? data?.answer ?? data);
      const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Failed to get AI response. Please try again.', type: 'error' });
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again or rephrase your question.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-24"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 opacity-20 dark:opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-400/20 dark:from-primary-950/50 dark:to-accent-600/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/20 dark:bg-accent-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container-custom section-padding relative z-10 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            AI & Automation
            <span className="block bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Solutions That Scale
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Empowering businesses with intelligent automation, workflow engineering, and cutting-edge
            technology solutions. From AI integration to DevOps excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              onClick={() => scrollToSection('#contact')}
              size="lg"
              className="min-w-[160px]"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('#services')}
              className="min-w-[160px]"
            >
              View Services
            </Button>
          </motion.div>
        </div>

        {/* Chat panel - large fixed overlay, no scroll, closes on Reset Chat */}
        <AnimatePresence>
          {(messages.length > 0 || isLoading) && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50"
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-4 sm:inset-8 md:inset-12 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="w-full max-w-3xl h-full max-h-[85vh] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden bg-white dark:bg-gray-800 pointer-events-auto flex flex-col">
                  {/* Chat header - KreddyKing style */}
                  <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-primary-700 dark:bg-primary-900 text-white">
                    <div>
                      <h3 className="font-semibold text-lg">Chat with SupriyaTechTalks AI</h3>
                      <p className="text-sm text-primary-200 dark:text-primary-300 opacity-90">Ask me anything about AI, automation, or our services</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetChat}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Reset chat"
                    >
                      Reset Chat
                    </button>
                  </div>
                  {/* Chat body - big, fills space */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 bg-white dark:bg-gray-800">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((j) => (
                          <motion.span
                            key={j}
                            className="w-2 h-2 rounded-full bg-gray-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: j * 0.1 }}
                          />
                        ))}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
                  </div>
                  {/* Input at bottom of chat panel */}
                  <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                        aria-label="Type message"
                      />
                      <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send"
                      >
                        {isLoading ? (
                          <motion.svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* KreddyKing-style search bar - always at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about AI, automation, or our services..."
              disabled={isLoading}
              className="w-full px-6 py-4 sm:py-5 pl-6 pr-16 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Ask AI assistant"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 p-2.5 sm:p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-gray-900 shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Send"
            >
              {isLoading ? (
                <motion.svg
                  className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </motion.svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection('#services')}
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          aria-label="Scroll to services"
        >
          <span className="text-sm font-medium">Explore</span>
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </button>
      </motion.div>
    </section>
  );
}
