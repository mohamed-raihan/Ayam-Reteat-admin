'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Search, Video, Star, Edit, Trash2 } from 'lucide-react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import Image from 'next/image';

type SuccessVideos = {
  id: number;
  name: string;
  video: string;
  thumbnail: string;
  order: number;
  is_active: boolean;
};

type Reviews = {
  id: number;
  name: string;
  designation: string;
  company: string;
  review: string;
  country: string;
  date: string;
  profile_image: string;
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [videoForm, setVideoForm] = useState({
    name: '',
    video: null as File | null,
    thumbnail: null as File | null,
    order: 1,
    is_active: true,
  });

  const [reviewForm, setReviewForm] = useState({
    name: '',
    designation: '',
    company: '',
    review: '',
    country: '',
    profile_image: null as File | null,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Sample data
  const [videos, setVideos] = useState<SuccessVideos[]>([
    {
      id: 1,
      name: "Product Demo - Getting Started",
      thumbnail: "https://via.placeholder.com/120x80/6366f1/ffffff?text=Video",
      order: 1,
      is_active: true,
      video: "https://via.placeholder.com/120x80/6366f1/ffffff?text=Video"
    },
    {
      id: 2,
      name: "Advanced Features Tutorial",
      thumbnail: "https://via.placeholder.com/120x80/8b5cf6/ffffff?text=Video",
      order: 2,
      is_active: false,
      video: "https://via.placeholder.com/120x80/8b5cf6/ffffff?text=Video"
    }
  ]);

  const [reviews, setReviews] = useState<Reviews[]> ([
    {
      id: 1,
      name: "Sarah Johnson",
      designation: "Back-end Developer",
      company: "MyDodow",
      review: "This product has completely transformed how we work. Highly recommended!",
      country: "MyDodow",
      date: "2024-06-11",
      profile_image: "https://127.0.0.1:8000/media/media/review_images/Ellipse_1.png"
    },
    {
      id: 2,
      name: "Mike Chen",
      designation: "Back-end Developer",
      company: "MyDodow",
      review: "Solid product with good features. Customer support could be better.",
      country: "MyDodow",
      date: "2024-06-09",
      profile_image: "https://127.0.0.1:8000/media/media/review_images/Ellipse_1.png"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSuccessVideos = async () => {
    const response = await api.get(API_URL.HOME.SUCCESS_VIDEOS);
    setVideos(response.data);
  };

  const fetchReviews = async () => {
    const response = await api.get(API_URL.HOME.REVIEWS);
    if (response.data) {
      setReviews(response.data);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };


  useEffect(() => {
    fetchSuccessVideos();
    fetchReviews();
  }, []);

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', videoForm.name);
      if (videoForm.video) formData.append('video', videoForm.video);
      if (videoForm.thumbnail) formData.append('thumbnail', videoForm.thumbnail);
      formData.append('order', videoForm.order.toString());
      formData.append('is_active', videoForm.is_active.toString());

      if (editingId) {
        await api.put(API_URL.HOME.UPDATE_SUCCESS_VIDEO(editingId.toString()), formData);
        setSuccess('Video updated successfully!');
      } else {
        await api.post(API_URL.HOME.ADD_SUCCESS_VIDEO, formData);
        setSuccess('Video added successfully!');
      }

      setShowAddModal(false);
      fetchSuccessVideos();
      resetVideoForm();
    } catch (err) {
      setError('Failed to save video. Please try again.');
      console.error('Error saving video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.entries(reviewForm).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      if (editingId) {
        await api.put(API_URL.HOME.UPDATE_REVIEW(editingId.toString()), formData);
        setSuccess('Review updated successfully!');
      } else {
        await api.post(API_URL.HOME.ADD_REVIEW, formData);
        setSuccess('Review added successfully!');
      }

      setShowAddModal(false);
      fetchReviews();
      resetReviewForm();
    } catch (err) {
      setError('Failed to save review. Please try again.');
      console.error('Error saving review:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(API_URL.HOME.DELETE_SUCCESS_VIDEO(id.toString()));
      setSuccess('Video deleted successfully!');
      fetchSuccessVideos();
    } catch (err) {
      setError('Failed to delete video. Please try again.');
      console.error('Error deleting video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(API_URL.HOME.DELETE_REVIEW(id.toString()));
      setSuccess('Review deleted successfully!');
      fetchReviews();
    } catch (err) {
      setError('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVideo = (video: SuccessVideos) => {
    setEditingId(video.id);
    setVideoForm({
      name: video.name,
      video: null,
      thumbnail: null,
      order: video.order,
      is_active: video.is_active,
    });
    setShowAddModal(true);
  };

  const handleEditReview = (review: Reviews) => {
    setEditingId(review.id);
    setReviewForm({
      name: review.name,
      designation: review.designation,
      company: review.company,
      review: review.review,
      country: review.country,
      profile_image: null,
    });
    setShowAddModal(true);
  };

  const resetVideoForm = () => {
    setVideoForm({
      name: '',
      video: null,
      thumbnail: null,
      order: 1,
      is_active: true,
    });
    setEditingId(null);
  };

  const resetReviewForm = () => {
    setReviewForm({
      name: '',
      designation: '',
      company: '',
      review: '',
      country: '',
      profile_image: null,
    });
    setEditingId(null);
  };

  const AddVideoModal = () => (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
            <input
              type="text"
              value={videoForm.name}
              onChange={(e) => setVideoForm({ ...videoForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter video title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoForm({ ...videoForm, video: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required={!editingId}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required={!editingId}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={videoForm.order}
              onChange={(e) => setVideoForm({ ...videoForm, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={videoForm.is_active}
              onChange={(e) => setVideoForm({ ...videoForm, is_active: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Active</label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetVideoForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const AddReviewModal = () => (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Review' : 'Add New Review'}</h3>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter customer name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              value={reviewForm.designation}
              onChange={(e) => setReviewForm({ ...reviewForm, designation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter designation"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={reviewForm.company}
              onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter company name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={reviewForm.country}
              onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter country"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
            <textarea
              value={reviewForm.review}
              onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Enter review content"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReviewForm({ ...reviewForm, profile_image: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required={!editingId}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetReviewForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <p className="text-purple-100 mt-1">Manage your videos and reviews</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Video className="w-5 h-5 mr-2" />
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Star className="w-5 h-5 mr-2" />
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Controls */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add {activeTab === 'videos' ? 'Video' : 'Review'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'videos' ? (
            <div className="p-6">
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
              <div className="grid gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-24 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{video.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                        <span>Order: {video.order}</span>
                        <span>Is Active: {video.is_active ? 'Yes' : 'No'}</span> 
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        video.is_active === true 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        onClick={() => handleEditVideo(video)}
                        className="p-2 text-gray-400 hover:text-purple-600"
                        disabled={isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
              <div className="grid gap-4">
                {reviews?.map((review) => (
                  <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Image src={review.profile_image} alt={review.name} className="w-10 h-10 rounded-full" width={40} height={40} />
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {renderStars(5)}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-1">{review.designation} at {review.company}</h4>
                        <p className="text-gray-600 text-sm">{review.review}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => handleEditReview(review)}
                          className="p-2 text-gray-400 hover:text-purple-600"
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && activeTab === 'videos' && <AddVideoModal />}
      {showAddModal && activeTab === 'reviews' && <AddReviewModal />}
    </div>
  );
};

export default ContentManager;