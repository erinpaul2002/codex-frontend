import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Trash2, Lightbulb, Copy, Check } from 'lucide-react';
import { getChatResponse } from '../../utils/codeExecution';

export default function AIChat({ onSuggestCode, theme = 'dark', lightbulbRef, chatInputRef }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI coding assistant. I can help you with code suggestions, debugging, explanations, and general programming questions. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-focus input when component mounts
    const timer = setTimeout(() => {
      const textarea = document.querySelector('textarea[placeholder*="Ask me anything"]');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const aiResponse = await getChatResponse(currentInput, conversationHistory);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSuggestCodeInChat = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Add a user message to show what they requested
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: '🔍 Analyze my current code',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const suggestion = await onSuggestCode();
      
      if (suggestion) {
        const suggestionMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: suggestion,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, suggestionMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I couldn\'t analyze your code. Please make sure you have some code in the editor first.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error getting code suggestion:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while analyzing your code. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderMessageContent = (content) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-3 w-full">
            <div className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-t text-xs sticky top-0 z-10">
              <span className="text-gray-300 font-medium">{language || 'Code'}</span>
              <button
                onClick={() => copyToClipboard(code, `code-${index}`)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                title="Copy code"
              >
                {copiedId === `code-${index}` ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-800 rounded-b max-h-60 overflow-y-auto">
              <pre className="p-3 text-sm">
                <code className="text-green-400 block whitespace-pre-wrap break-words">{code}</code>
              </pre>
            </div>
          </div>
        );
      } else {
        // This is regular text
        return (
          <div key={index} className="whitespace-pre-wrap break-words">
            {part}
          </div>
        );
      }
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Chat cleared! How can I help you with your code today?",
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  const themeClasses = {
    dark: {
      container: 'bg-gray-900 border-gray-700',
      header: 'bg-gray-800 border-gray-700',
      message: 'bg-gray-800',
      userMessage: 'bg-blue-600',
      input: 'bg-gray-800 border-gray-600 text-white',
      text: 'text-white',
      textSecondary: 'text-gray-400'
    },
    light: {
      container: 'bg-white border-gray-200',
      header: 'bg-gray-50 border-gray-200',
      message: 'bg-gray-100',
      userMessage: 'bg-blue-500',
      input: 'bg-white border-gray-300 text-gray-900',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`flex flex-col h-full border-l ${currentTheme.container}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${currentTheme.header}`}>
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-5 h-5 ${currentTheme.text}`} />
          <h3 className={`font-semibold ${currentTheme.text}`}>AI Assistant</h3>
        </div>        <div className="flex items-center gap-2">          <button
            ref={lightbulbRef}
            onClick={handleSuggestCodeInChat}
            className={`p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 ${currentTheme.text}`}
            title="Analyze Current Code - Get suggestions, find issues, and improve your code"
            disabled={isLoading}
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className={`p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 ${currentTheme.text}`}
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'bot' ? currentTheme.message : currentTheme.userMessage
              }`}>
                {message.type === 'bot' ? (
                  <Bot className="w-4 h-4 text-blue-400" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`${message.type === 'user' ? 'inline-block max-w-[80%] ml-auto' : 'block'} p-3 rounded-lg ${
                  message.type === 'bot' ? currentTheme.message : currentTheme.userMessage
                }`}>
                  <div className={`text-sm ${message.type === 'bot' ? currentTheme.text : 'text-white'}`}>
                    {message.type === 'bot' ? renderMessageContent(message.content) : (
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-1 ${currentTheme.textSecondary} ${message.type === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentTheme.message}`}>
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className={`inline-block p-3 rounded-lg ${currentTheme.message}`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`p-3 border-t ${currentTheme.header} bg-opacity-95 backdrop-blur-sm`}>
        <div className="flex gap-2 items-end">          <div className="flex-1">
            <textarea
              ref={chatInputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your code... (Shift+Enter for new line, Enter to send)"
              className={`w-full resize-none rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${currentTheme.input}`}
              rows={inputMessage.includes('\n') ? Math.min(inputMessage.split('\n').length, 4) : 2}
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all min-w-[48px] h-11"
            title={isLoading ? 'Sending...' : 'Send message'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
