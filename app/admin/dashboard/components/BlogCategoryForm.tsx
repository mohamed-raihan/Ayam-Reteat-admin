"use client";
import React, { useState } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import { toast } from 'react-toastify';

const BlogCategoryForm = ({ fetchCategories, setShowModal }: { fetchCategories: () => void, setShowModal: (show: boolean) => void }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.post(API_URL.BLOGS.POST_BLOG_CATEGORIES, { title });
      setSuccess('Category created successfully!');
      setTitle('');
      fetchCategories();
      toast.success('Category created successfully!');
      setLoading(false);
      setShowModal(false);
    } catch (err: any) {
      setError('Failed to create category.');
      toast.error('Failed to create category.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Category Title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Category'}
      </button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default BlogCategoryForm; 