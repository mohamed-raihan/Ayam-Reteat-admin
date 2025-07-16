"use client";
import React, { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import { toast } from 'react-toastify';
import { BlogCategory } from './Blog-innerTable';

interface Heading {
  id: number;
  title: string;
  description?: string;
}

interface Blog {
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
  country_name?: string;
  description?: string;
  time?: string;
}

type BlogCreateFormProps = {
  fetchBlogs: () => void;
  setShowModal: (show: boolean) => void;
  editData?: Blog;
  onSuccess?: () => void;
  onClose?: () => void;
};

const BlogCreateForm = ({ fetchBlogs, setShowModal, editData, onSuccess, onClose }: BlogCreateFormProps) => {
  const [form, setForm] = useState({
    country_name: editData?.country_name || '',
    title: editData?.title || '',
    date: editData?.date || '',
    time: editData?.time || '',
    blog_image: null as File | null,
    author: editData?.author || '',
    description: editData?.description || '',
    blog_category: editData?.blog_category ? String(editData.blog_category) : '',
    blog_heading: editData?.blog_heading ? String(editData.blog_heading) : '',
  });
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories and headings
    const fetchData = async () => {
      try {
        const [catRes, headRes] = await Promise.all([
          api.get(API_URL.BLOGS.GET_BLOG_CATEGORIES),
          api.get(API_URL.BLOGS.GET_BLOG_HEADERS),
        ]);
        setCategories(catRes.data);
        setHeadings(headRes.data);
      } catch (err) {
        console.log(err);
        // ignore for now
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (editData) {
      setForm({
        country_name: editData.country_name || '',
        title: editData.title || '',
        date: editData.date || '',
        time: editData.time || '',
        blog_image: null,
        author: editData.author || '',
        description: editData.description || '',
        blog_category: editData.blog_category ? String(editData.blog_category) : '',
        blog_heading: editData.blog_heading ? String(editData.blog_heading) : '',
      });
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: target.files ? target.files[0] : null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (editData) {
        // Edit mode
        await api.put(API_URL.BLOGS.PATCH_BLOGS(editData.id.toString()), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Blog updated successfully!');
        toast.success('Blog updated successfully!');
      } else {
        // Create mode
        await api.post(API_URL.BLOGS.POST_BLOGS, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Blog created successfully!');
        toast.success('Blog created successfully!');
      }
      fetchBlogs();
      setShowModal(false);
      if (onSuccess) onSuccess();
      setForm({
        country_name: '',
        title: '',
        date: '',
        time: '',
        blog_image: null,
        author: '',
        description: '',
        blog_category: '',
        blog_heading: '',
      });
    } catch (err) {
      console.log(err);
      setError(editData ? 'Failed to update blog.' : 'Failed to create blog.');
      toast.error(editData ? 'Failed to update blog.' : 'Failed to create blog.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="country_name" value={form.country_name} onChange={handleChange} placeholder="Country Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
      <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
      <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
      <input type="file" name="blog_image" accept="image/*" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" rows={4} required />
      <select name="blog_category" value={form.blog_category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
        <option value="">Select Category</option>
        {categories.map((cat: BlogCategory) => (
          <option key={cat.id} value={cat.id}>{cat.title}</option>
        ))}
      </select>
      <select name="blog_heading" value={form.blog_heading} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
        <option value="">Select Heading</option>
        {headings.map((head: Heading) => (
          <option key={head.id} value={head.id}>{head.title}</option>
        ))}
      </select>
      <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50" disabled={loading}>
        {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Blog' : 'Create Blog')}
      </button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default BlogCreateForm; 