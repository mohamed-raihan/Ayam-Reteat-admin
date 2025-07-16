"use client";
import React, { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import { toast } from 'react-toastify';
import BlogCreateForm from './BlogCreateForm';

export interface Blog {
  id: number;
  title: string;
  author: string;
  date: string;
  blog_image: string;
  blog_category: number | string;
  blog_category_title?: string;
  blog_heading: number | string;
  blog_heading_title?: string;
  is_active?: boolean;
  // Add other fields as needed
}

const BlogList = ({ blogs, fetchBlogs }: { blogs: Blog[]; fetchBlogs: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (blog: Blog) => {
    setEditData(blog);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(API_URL.BLOGS.DELETE_BLOGS(id.toString()));
      fetchBlogs();
      toast.success('Blog deleted successfully!');
    } catch (err) {
      console.log(err);
      setError('Failed to delete blog.');
      toast.error('Failed to delete blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchBlogs();
  })

  return (
    <div className="grid gap-4">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {blogs.length > 0 ? blogs.map((blog) => (
        <div key={blog.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <img
            src={blog.blog_image || '/placeholder.png'}
            alt={blog.title}
            className="w-24 h-16 object-cover rounded-md mr-4 bg-gray-100"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{blog.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
              <span>Author: {blog.author}</span>
              <span>Date: {blog.date}</span>
              <span>Category: {blog.blog_category_title || blog.blog_category}</span>
              <span>Heading: {blog.blog_heading_title || blog.blog_heading}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {typeof blog.is_active !== 'undefined' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                blog.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.is_active ? 'Active' : 'Inactive'}
              </span>
            )}
            <button className="p-2 text-gray-400 hover:text-purple-600" title="Edit" onClick={() => handleEdit(blog)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600" title="Delete" onClick={() => handleDelete(blog.id)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )) : <div className="text-center text-gray-500">No blogs found</div>}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowForm(false); setEditData(null); }}
            >
              ×
            </button>
            <BlogCreateForm
              editData={editData ?? undefined}
              onSuccess={() => { setShowForm(false); setEditData(null); fetchBlogs(); }}
              onClose={() => { setShowForm(false); setEditData(null); }}
              fetchBlogs={fetchBlogs}
              setShowModal={setShowForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList; 