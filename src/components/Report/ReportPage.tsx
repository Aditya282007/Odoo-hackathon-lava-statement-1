import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, AlertTriangle, Send } from 'lucide-react';

const ReportPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    'Inappropriate behavior',
    'Harassment or bullying',
    'Spam or fake profile',
    'Inappropriate content',
    'Scam or fraud',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    
    console.log('Report submitted:', { userId, reason, details });
    
    alert('Report submitted successfully. Thank you for helping keep our community safe.');
    navigate('/home');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flag className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-semibold">Report User</h1>
        </div>
        <p className="text-light-text-muted dark:text-dark-text-muted">Help us maintain a safe and respectful community</p>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 text-orange-500" />
          <div>
            <h3 className="font-semibold mb-1 text-orange-800 dark:text-orange-200">Important</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Please only submit reports for genuine violations of our community guidelines. 
              False reports may result in action against your account.
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Reason for reporting *
            </label>
            <div className="space-y-2">
              {reasons.map((reasonOption) => (
                <label
                  key={reasonOption}
                  className="flex items-center gap-3 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl hover:bg-light-border/50 dark:hover:bg-dark-border/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-light-accent dark:text-dark-accent"
                  />
                  <span className="font-medium">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Please provide any additional context that might help us investigate this report..."
              className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent resize-none transition-all"
            />
            <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-2">
              Maximum 500 characters ({details.length}/500)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex-1 px-6 py-3 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="bg-light-border/30 dark:bg-dark-border/30 rounded-2xl p-6">
        <h3 className="font-semibold mb-3">Community Guidelines</h3>
        <ul className="text-sm space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
          <li>• Treat all community members with respect and kindness</li>
          <li>• No harassment, bullying, or discriminatory behavior</li>
          <li>• Keep content professional and appropriate</li>
          <li>• No spam, fake profiles, or misleading information</li>
          <li>• Respect privacy and confidentiality</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportPage;