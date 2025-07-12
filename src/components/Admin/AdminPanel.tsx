import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, FileText, Eye, Ban, Check } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');

  const reports = [
    {
      id: 1,
      reportedUser: { name: 'John Smith', avatar: 'JS', id: 123 },
      reportedBy: { name: 'Sarah Chen', avatar: 'SC' },
      reason: 'Inappropriate behavior',
      details: 'User was making inappropriate comments during collaboration discussions.',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      reportedUser: { name: 'Mike Brown', avatar: 'MB', id: 456 },
      reportedBy: { name: 'Emily Johnson', avatar: 'EJ' },
      reason: 'Spam or fake profile',
      details: 'Profile appears to be fake with stolen photos and inflated skills.',
      timestamp: '1 day ago',
      status: 'under_review'
    },
  ];

  const flaggedUsers = [
    {
      id: 123,
      name: 'John Smith',
      avatar: 'JS',
      email: 'john.smith@email.com',
      reportCount: 3,
      lastActive: '1 hour ago',
      status: 'active'
    },
    {
      id: 456,
      name: 'Mike Brown',
      avatar: 'MB',
      email: 'mike.brown@email.com',
      reportCount: 1,
      lastActive: '2 days ago',
      status: 'suspended'
    },
  ];

  const handleReportAction = (reportId: number, action: 'approve' | 'dismiss') => {
    console.log(`${action} report ${reportId}`);
  };

  const handleUserAction = (userId: number, action: 'ban' | 'suspend' | 'activate') => {
    console.log(`${action} user ${userId}`);
  };

  const ReportCard = ({ report }: { report: any }) => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-sm font-semibold text-white">
            {report.reportedUser.avatar}
          </div>
          <div>
            <h3 className="font-semibold">{report.reportedUser.name}</h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Reported by {report.reportedBy.name}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          report.status === 'pending' 
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {report.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Reason: {report.reason}</h4>
        <p className="text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{report.details}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-light-text-muted dark:text-dark-text-muted">{report.timestamp}</span>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleReportAction(report.id, 'dismiss')}
            className="flex items-center gap-1 px-3 py-1 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border text-sm font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            Dismiss
          </button>
          <button
            onClick={() => handleReportAction(report.id, 'approve')}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors"
          >
            <Ban className="w-4 h-4" />
            Take Action
          </button>
        </div>
      </div>
    </div>
  );

  const UserCard = ({ user }: { user: any }) => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-sm font-semibold text-white">
            {user.avatar}
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted">{user.email}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          user.status === 'active' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {user.status.toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-light-text-muted dark:text-dark-text-muted">
          <span>{user.reportCount} reports • Last active {user.lastActive}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleUserAction(user.id, 'suspend')}
            className="px-3 py-1 bg-orange-500 text-white rounded-xl hover:bg-orange-600 text-sm font-medium transition-colors"
          >
            Suspend
          </button>
          <button
            onClick={() => handleUserAction(user.id, 'ban')}
            className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition-colors"
          >
            Ban
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-light-accent dark:text-dark-accent" />
          <h1 className="text-3xl font-semibold">Admin Panel</h1>
        </div>
        <p className="text-light-text-muted dark:text-dark-text-muted">Manage reports and moderate the community</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-2xl font-semibold">12</h3>
              <p className="text-light-text-muted dark:text-dark-text-muted">Pending Reports</p>
            </div>
          </div>
        </div>
        
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-2xl font-semibold">5</h3>
              <p className="text-light-text-muted dark:text-dark-text-muted">Flagged Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-2xl font-semibold">1,234</h3>
              <p className="text-light-text-muted dark:text-dark-text-muted">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-light-accent dark:bg-dark-accent text-white'
                : 'hover:bg-light-border/50 dark:hover:bg-dark-border/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Reports ({reports.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-4 font-medium transition-all border-l border-light-border dark:border-dark-border ${
              activeTab === 'users'
                ? 'bg-light-accent dark:bg-dark-accent text-white'
                : 'hover:bg-light-border/50 dark:hover:bg-dark-border/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>Flagged Users ({flaggedUsers.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'reports' ? (
          reports.length > 0 ? (
            reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 text-light-text-muted dark:text-dark-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending reports</p>
            </div>
          )
        ) : (
          flaggedUsers.length > 0 ? (
            flaggedUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <div className="text-center py-12 text-light-text-muted dark:text-dark-text-muted">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No flagged users</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminPanel;