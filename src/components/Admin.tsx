import React, { useState } from 'react';
import { Shield, Users, RefreshCw, MessageSquare, Download, Ban, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Admin: React.FC = () => {
  const { currentUser, users, swapRequests, reviews, adminMessages, banUser, setAdminMessages } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'swaps' | 'messages' | 'reports'>('users');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'maintenance',
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleBanUser = (userId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      banUser(userId);
    }
  };

  const handleSendMessage = () => {
    const message = {
      id: Date.now().toString(),
      ...newMessage,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setAdminMessages([...adminMessages, message]);
    setShowMessageModal(false);
    setNewMessage({ title: '', content: '', type: 'info' });
  };

  const downloadReport = (type: string) => {
    let data = '';
    let filename = '';
    
    switch (type) {
      case 'users':
        data = JSON.stringify(users, null, 2);
        filename = 'users-report.json';
        break;
      case 'swaps':
        data = JSON.stringify(swapRequests, null, 2);
        filename = 'swaps-report.json';
        break;
      case 'reviews':
        data = JSON.stringify(reviews, null, 2);
        filename = 'reviews-report.json';
        break;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusStats = () => {
    const pending = swapRequests.filter(req => req.status === 'pending').length;
    const accepted = swapRequests.filter(req => req.status === 'accepted').length;
    const completed = swapRequests.filter(req => req.status === 'completed').length;
    const rejected = swapRequests.filter(req => req.status === 'rejected').length;
    
    return { pending, accepted, completed, rejected };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Shield className="w-6 h-6 text-white" />
          <span>Admin Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Swaps</p>
                <p className="text-2xl font-bold text-white">{stats.accepted}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Pending Requests</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {[
            { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { key: 'swaps', label: 'Swaps', icon: <RefreshCw className="w-4 h-4" /> },
            { key: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
            { key: 'reports', label: 'Reports', icon: <Download className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800">
                <div className="flex items-center space-x-4">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <div className="flex space-x-2 mt-1">
                      {user.isAdmin && (
                        <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded-full">Admin</span>
                      )}
                      {user.isBanned && (
                        <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">Banned</span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isPublic ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {user.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{user.totalSwaps} swaps</span>
                  {!user.isAdmin && !user.isBanned && (
                    <button
                      onClick={() => handleBanUser(user.id)}
                      className="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700 transition-colors flex items-center space-x-1 shadow-lg"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Ban</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Swaps Tab */}
      {activeTab === 'swaps' && (
        <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Swap Monitoring</h3>
          <div className="space-y-4">
            {swapRequests.map(request => (
              <div key={request.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">
                    {request.fromUserName} → {request.toUserName}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Offered:</span>
                    <span className="ml-2 px-2 py-1 bg-green-900 text-green-300 rounded">
                      {request.skillOffered}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Wanted:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-900 text-blue-300 rounded">
                      {request.skillWanted}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">Created: {request.createdAt}</p>
                {request.message && (
                  <p className="text-sm text-gray-300 mt-2 p-2 bg-gray-700 rounded">
                    "{request.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Platform Messages</h3>
            <button
              onClick={() => setShowMessageModal(true)}
              className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
          <div className="space-y-4">
            {adminMessages.map(message => (
              <div key={message.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{message.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.type === 'info' ? 'bg-blue-900 text-blue-300' :
                    message.type === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {message.type}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{message.content}</p>
                <p className="text-sm text-gray-400">Sent: {message.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Download Reports</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => downloadReport('users')}
              className="p-4 border border-gray-700 rounded-2xl hover:bg-gray-900 transition-colors bg-gray-900"
            >
              <Download className="w-8 h-8 text-white mx-auto mb-2" />
              <h4 className="font-medium text-white">User Activity</h4>
              <p className="text-sm text-gray-400">Download user data and statistics</p>
            </button>
            
            <button
              onClick={() => downloadReport('swaps')}
              className="p-4 border border-gray-700 rounded-2xl hover:bg-gray-900 transition-colors bg-gray-900"
            >
              <Download className="w-8 h-8 text-white mx-auto mb-2" />
              <h4 className="font-medium text-white">Swap Statistics</h4>
              <p className="text-sm text-gray-400">Download swap request data</p>
            </button>
            
            <button
              onClick={() => downloadReport('reviews')}
              className="p-4 border border-gray-700 rounded-2xl hover:bg-gray-900 transition-colors bg-gray-900"
            >
              <Download className="w-8 h-8 text-white mx-auto mb-2" />
              <h4 className="font-medium text-white">Feedback Logs</h4>
              <p className="text-sm text-gray-400">Download review and rating data</p>
            </button>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl max-w-md w-full p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-white">Send Platform Message</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newMessage.title}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newMessage.type}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.title || !newMessage.content}
                className="flex-1 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;