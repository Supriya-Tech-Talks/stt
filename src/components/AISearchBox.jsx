import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const AI_SEARCH_WEBHOOK = 'https://n8n.srv954053.hstgr.cloud/webhook/supriya-search-ai';

export default function AISearchBox() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => scrollToBottom(), [messages]);

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

      const responseText = typeof data === 'string' ? data : data?.response ?? data?.answer ?? JSON.stringify(data);
      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Failed to get AI response. Please try again.', type: 'error' });
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again or rephrase your question.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="section-padding bg-white dark:bg-gray-900" aria-labelledby="ai-assistant-heading">
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 id="ai-assistant-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Ask Our AI Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant answers about our services, AI solutions, automation, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-xl overflow-hidden"
        >
          {/* Chat messages area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center px-4">
                <svg className="w-16 h-16 mb-4 text-primary-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium mb-1">How can I help you today?</p>
                <p className="text-sm">Ask about AI, automation, our services, or anything else.</p>
              </div>
            )}

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
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
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
                <div className="rounded-2xl rounded-bl-md bg-gray-200 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      />
                    ))}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Search input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Ask AI assistant"
                  aria-describedby="ai-search-hint"
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
            <p id="ai-search-hint" className="sr-only">
              Enter your question and press Send to get a response from our AI assistant.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
