import React, { useState } from 'react';
import { Check, X, Clock, User } from 'lucide-react';

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'SC', skills: ['React', 'TypeScript'] },
      message: 'Hi! I\'d love to collaborate on a React project. I saw your experience with TypeScript and think we could build something amazing together.',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      user: { name: 'Mike Rodriguez', avatar: 'MR', skills: ['Node.js', 'Python'] },
      message: 'Would you be interested in working on a backend API project? I think our skills complement each other well.',
      timestamp: '1 day ago',
      status: 'pending'
    },
  ];

  const sentRequests = [
    {
      id: 3,
      user: { name: 'Emily Johnson', avatar: 'EJ', skills: ['Mobile', 'React Native'] },
      message: 'Hey Emily! I\'m interested in learning mobile development. Would you be open to collaborating on a React Native project?',
      timestamp: '3 hours ago',
      status: 'pending'
    },
    {
      id: 4,
      user: { name: 'Alex Kim', avatar: 'AK', skills: ['Python', 'ML'] },
      message: 'I\'d love to work with you on a machine learning project. My React skills could help with the frontend.',
      timestamp: '2 days ago',
      status: 'accepted'
    },
  ];

  const handleAccept = (requestId: number) => {
    console.log('Accepted request:', requestId);
  };

  const handleDecline = (requestId: number) => {
    console.log('Declined request:', requestId);
  };

  const RequestCard = ({ request, type }: { request: any; type: 'received' | 'sent' }) => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-lg font-semibold text-white">
          {request.user.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold">{request.user.name}</h3>
            <div className="flex gap-1">
              {request.user.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-xs font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <p className="mb-4 leading-relaxed text-sm text-light-text-secondary dark:text-dark-text-secondary">{request.message}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
              <Clock className="w-4 h-4" />
              <span>{request.timestamp}</span>
              {request.status === 'accepted' && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-lg ml-2">
                  Accepted
                </span>
              )}
            </div>
            
            {type === 'received' && request.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-light-border dark:bg-dark-border text-sm font-medium rounded-xl hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Collaboration Requests</h1>
        <p className="text-light-text-muted dark:text-dark-text-muted">Manage your collaboration requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'received'
                ? 'bg-light-accent dark:bg-dark-accent text-white'
                : 'hover:bg-light-border/50 dark:hover:bg-dark-border/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <span>Requests Received ({receivedRequests.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-6 py-4 font-medium transition-all border-l border-light-border dark:border-dark-border ${
              activeTab === 'sent'
                ? 'bg-light-accent dark:bg-dark-accent text-white'
                : 'hover:bg-light-border/50 dark:hover:bg-dark-border/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <span>Requests Sent ({sentRequests.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map(request => (
              <RequestCard key={request.id} request={request} type="received" />
            ))
          ) : (
            <div className="text-center py-12 text-light-text-muted dark:text-dark-text-muted">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No requests received yet</p>
              <p className="text-sm">When others want to collaborate with you, their requests will appear here</p>
            </div>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map(request => (
              <RequestCard key={request.id} request={request} type="sent" />
            ))
          ) : (
            <div className="text-center py-12 text-light-text-muted dark:text-dark-text-muted">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No requests sent yet</p>
              <p className="text-sm">Start exploring users and send collaboration requests</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RequestsPage;