import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SwapRequest } from '../types';

const Swaps: React.FC = () => {
  const { currentUser, swapRequests, updateSwapRequest, addReview } = useApp();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Please sign in to view your swaps.</p>
      </div>
    );
  }

  const receivedRequests = swapRequests.filter(req => req.toUserId === currentUser.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === currentUser.id);

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'accepted' });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'rejected' });
  };

  const handleDelete = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'cancelled' });
  };

  const handleComplete = (request: SwapRequest) => {
    updateSwapRequest(request.id, { 
      status: 'completed',
      completedAt: new Date().toISOString().split('T')[0]
    });
    setSelectedSwap(request);
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!selectedSwap || !currentUser) return;

    const revieweeId = activeTab === 'received' ? selectedSwap.fromUserId : selectedSwap.toUserId;
    const revieweeName = activeTab === 'received' ? selectedSwap.fromUserName : selectedSwap.toUserName;
    const skillExchanged = activeTab === 'received' ? selectedSwap.skillOffered : selectedSwap.skillWanted;

    const newReview = {
      id: Date.now().toString(),
      swapRequestId: selectedSwap.id,
      reviewerId: currentUser.id,
      revieweeId,
      reviewerName: currentUser.name,
      revieweeName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      skillExchanged,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReview(newReview);
    setShowReviewModal(false);
    setSelectedSwap(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'cancelled': return <Trash2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderSwapCard = (request: SwapRequest, isReceived: boolean) => (
    <div key={request.id} className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {isReceived ? request.fromUserName : request.toUserName}
          </h3>
          <p className="text-sm text-gray-400">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="capitalize">{request.status}</span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            {isReceived ? 'They Offer' : 'You Offer'}
          </h4>
          <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
            {request.skillOffered}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            {isReceived ? 'They Want' : 'You Want'}
          </h4>
          <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
            {request.skillWanted}
          </span>
        </div>
      </div>

      {request.message && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Message</h4>
          <p className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3">{request.message}</p>
        </div>
      )}

      <div className="flex space-x-3">
        {request.status === 'pending' && isReceived && (
          <>
            <button
              onClick={() => handleAccept(request.id)}
              className="flex-1 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleReject(request.id)}
              className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </>
        )}

        {request.status === 'pending' && !isReceived && (
          <button
            onClick={() => handleDelete(request.id)}
            className="bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            <span>Cancel Request</span>
          </button>
        )}

        {request.status === 'accepted' && (
          <button
            onClick={() => handleComplete(request)}
            className="bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg font-medium"
          >
            <Star className="w-4 h-4" />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">My Swaps</h2>
        
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'received'
                ? 'bg-white text-black rounded-full'
                : 'text-gray-400 hover:text-white hover:bg-gray-900 rounded-full'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-white text-black rounded-full'
                : 'text-gray-400 hover:text-white hover:bg-gray-900 rounded-full'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map(request => renderSwapCard(request, true))
          ) : (
            <div className="text-center py-12 bg-black rounded-3xl shadow-lg border border-gray-800">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No swap requests received yet.</p>
            </div>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map(request => renderSwapCard(request, false))
          ) : (
            <div className="text-center py-12 bg-black rounded-3xl shadow-lg border border-gray-800">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No swap requests sent yet.</p>
            </div>
          )
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl max-w-md w-full p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Rate Your Experience
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`w-8 h-8 ${
                        star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swaps;