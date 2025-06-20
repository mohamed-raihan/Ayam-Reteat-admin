'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Search, Video, Star, Edit, Trash2 } from 'lucide-react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import Image from 'next/image';
import { toast } from 'react-toastify';

type SuccessVideos = {
  id: number;
  name: string;
  video: string | File | null;
  thumbnail: string | File | null;
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
  profile_image: string | File | null;
  date: string;
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [videoForm, setVideoForm] = useState<SuccessVideos>({
    id: 0,
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
    date: '',
  });

  // Add new state for file names
  const [videoFileName, setVideoFileName] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [profileImageFileName, setProfileImageFileName] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);

  // Sample data
  const [videos, setVideos] = useState<SuccessVideos[]>([
    {
      id: 1,
      name: "Product Demo - Getting Started",
      thumbnail: "/placeholder-video.png",
      order: 1,
      is_active: true,
      video: "/placeholder-video.mp4"
    },
    {
      id: 2,
      name: "Advanced Features Tutorial",
      thumbnail: "/placeholder-video.png",
      order: 2,
      is_active: false,
      video: "/placeholder-video.mp4"
    }
  ]);

  const [reviews, setReviews] = useState<Reviews[]>([
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
    console.log(response);
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

  // Filtered lists based on search
  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredReviews = reviews.filter(review =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSuccessVideos();
    fetchReviews();
  }, []);

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', videoForm.name);
      if (videoForm.video) formData.append('video', videoForm.video);
      if (videoForm.thumbnail) formData.append('thumbnail', videoForm.thumbnail);
      formData.append('order', videoForm.order.toString());
      formData.append('is_active', videoForm.is_active.toString());

      if (editingId) {
        await api.put(API_URL.HOME.UPDATE_SUCCESS_VIDEO(editingId.toString()), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Video updated successfully!');
        // setSuccess('Video updated successfully!');
      } else {
        await api.post(API_URL.HOME.ADD_SUCCESS_VIDEO, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Video added successfully!');
        // setSuccess('Video added successfully!');
      }

      console.log('inside submit');

      setShowAddModal(false);
      fetchSuccessVideos();
      resetVideoForm();
      // Reset file names
      setVideoFileName('');
      setThumbnailFileName('');
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
    // setSuccess(null);

    try {
      const formData = new FormData();
      Object.entries(reviewForm).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      if (editingId) {
        await api.put(API_URL.HOME.UPDATE_REVIEW(editingId.toString()), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Review updated successfully!');
        // setSuccess('Review updated successfully!');
      } else {
        await api.post(API_URL.HOME.ADD_REVIEW, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Review added successfully!');
        // setSuccess('Review added successfully!');
      }

      setShowAddModal(false);
      fetchReviews();
      resetReviewForm();
      // Reset file name
      setProfileImageFileName('');
    } catch (err) {
      setError('Failed to save review. Please try again.');
      toast.error('Failed to save review. Please try again.');
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
      toast.success('Video deleted successfully!');
      // setSuccess('Video deleted successfully!');
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
      toast.success('Review deleted successfully!');
      // setSuccess('Review deleted successfully!');
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
      id: video.id,
      name: video.name,
      video: video.video,
      thumbnail: video.thumbnail,
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
      date: '',
    });
    setShowAddModal(true);
  };

  const resetVideoForm = () => {
    setVideoForm({
      id: 0,
      name: '',
      video: null,
      thumbnail: null,
      order: 1,
      is_active: true,
    });
    setVideoFileName('');
    setThumbnailFileName('');
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
      date: '',
    });
    setProfileImageFileName('');
    setEditingId(null);
  };

  console.log(reviewForm);
  console.log(videoForm);
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
              className={`flex items-center px-6 py-4 font-medium transition-colors ${activeTab === 'videos'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
                }`}
            >
              <Video className="w-5 h-5 mr-2" />
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${activeTab === 'reviews'
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
              {/* {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}   */}
              <div className="grid gap-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image
                      src={video.thumbnail instanceof File ? URL.createObjectURL(video.thumbnail) : video.thumbnail || '/placeholder-video.png'}
                      alt={video.name}
                      className="w-24 h-16 object-cover rounded-md mr-4"
                      width={120}
                      height={80}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{video.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                        <span>Order: {video.order}</span>
                        <span>Is Active: {video.is_active ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${video.is_active === true
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
              {/* {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>} */}
              <div className="grid gap-4">
                {filteredReviews?.map((review) => (
                  <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Image src={review.profile_image instanceof File ? URL.createObjectURL(review.profile_image) : review.profile_image || '/placeholder-profile.png'} alt={review.name} className="w-10 h-10 rounded-full" width={40} height={40} />
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
      {showAddModal && activeTab === 'videos' &&
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {/* {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>} */}
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  value={videoForm.name}
                  onChange={(e) => {
                    console.log('Typing:', e.target.value);
                    setVideoForm(prev => ({ ...prev, name: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter video title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setVideoForm(prev => ({ ...prev, video: file }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    id="video-upload"
                    required={!editingId}
                  />
                  {videoForm.video && (
                    <video width={50} controls preload="none">
                      <source
                        src={
                          videoForm.video instanceof File
                            ? URL.createObjectURL(videoForm.video)
                            : (videoForm.video as string)
                        }
                        type="video/mp4"
                      />

                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setVideoForm(prev => ({ ...prev, thumbnail: file }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    id="thumbnail-upload"
                    required={!editingId}
                  />
                  {videoForm.thumbnail && (
                    <Image
                      src={
                        videoForm.thumbnail instanceof File
                          ? URL.createObjectURL(videoForm.thumbnail)
                          : (videoForm.thumbnail as string)
                      }
                      alt="Thumbnail Preview"
                      className='border rounded-lg border'
                      width={50}
                      height={50}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={videoForm.order}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={videoForm.is_active}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, is_active: e.target.checked }))}
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
      }
      {showAddModal && activeTab === 'reviews' &&
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Review' : 'Add New Review'}</h3>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {/* {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>} */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
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
                  onChange={(e) => setReviewForm(prev => ({ ...prev, designation: e.target.value }))}
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
                  onChange={(e) => setReviewForm(prev => ({ ...prev, company: e.target.value }))}
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
                  onChange={(e) => setReviewForm(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter country"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={reviewForm.date}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    name="profile_image"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setReviewForm(prev => ({ ...prev, profile_image: file }));
                      setProfileImageFileName(file?.name || '');
                    }}
                    className="hidden"
                    id="profile-image-upload"
                    required={!editingId}
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    {profileImageFileName || 'Choose profile image'}
                  </label>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Enter review content"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6 col-span-2">
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
      }
    </div>
  );
};

export default ContentManager;