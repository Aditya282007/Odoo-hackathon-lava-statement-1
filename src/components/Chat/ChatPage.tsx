import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, Smile, Phone, Video } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = {
    name: 'Sarah Chen',
    avatar: 'SC',
    skills: ['React', 'TypeScript', 'Design'],
    isOnline: true,
  };

  const [messages] = useState([
    {
      id: 1,
      sender: 'Sarah Chen',
      content: 'Hi! Thanks for accepting my collaboration request. I\'m excited to work together!',
      timestamp: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'Absolutely! I\'ve been looking for someone with your React expertise. What kind of project did you have in mind?',
      timestamp: '10:32 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'Sarah Chen',
      content: 'I was thinking we could build a modern dashboard application. Something that showcases both of our skills - I can handle the design and React components, while you could work on the backend integration.',
      timestamp: '10:35 AM',
      isMe: false,
    },
    {
      id: 4,
      sender: 'You',
      content: 'That sounds perfect! I love working on full-stack projects. Do you have any specific requirements or technologies in mind?',
      timestamp: '10:37 AM',
      isMe: true,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-t-2xl p-4 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-sm font-semibold text-white">
                {user.avatar}
              </div>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-light-surface dark:border-dark-surface rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <div className="flex gap-1">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-xs font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border transition-colors">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-light-surface dark:bg-dark-surface border-x border-light-border dark:border-dark-border overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.isMe
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className="text-xs mt-2 opacity-60">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-light-surface dark:bg-dark-surface rounded-b-2xl p-4 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border border-t-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent pr-12 transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-light-accent dark:bg-dark-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;