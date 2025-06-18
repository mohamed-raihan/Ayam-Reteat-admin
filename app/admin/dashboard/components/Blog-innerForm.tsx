import React, { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import { toast } from 'react-toastify';

interface Blog {
  id: number;
  title: string;
}

interface BlogInnerFormProps {
  editData?: any;
  onSuccess?: () => void;
  onClose?: () => void;
  fetchBlogInners?: () => void;
  setShowModal?: (show: boolean) => void;
}

const BlogInnerForm: React.FC<BlogInnerFormProps> = ({ editData, onSuccess, onClose, fetchBlogInners, setShowModal }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState({
    blog: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try { 
        const res = await api.get(API_URL.BLOGS.GET_BLOGS);
        setBlogs(res.data);
      } catch (err) {
        // ignore for now
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        blog: editData.blog || '',
        description: editData.description || '',
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      if (!form.blog || !form.description) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      if (editData && editData.id) {
        await api.patch(API_URL.BLOG_INNER.PATCH_BLOG_INNER(editData.id), form);
        setSuccess('Blog Inner updated successfully!');
      } else {
        await api.post(API_URL.BLOG_INNER.POST_BLOG_INNER, form);
        setSuccess('Blog Inner created successfully!');
        setForm({ blog: '', description: '' });
      }
      if (fetchBlogInners) fetchBlogInners();
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      if (setShowModal) setShowModal(false);
      toast.success('Blog Inner saved successfully!');
    } catch (err: any) {
      setError('Failed to save Blog Inner.');
      toast.error('Failed to save Blog Inner.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="blog"
        value={form.blog}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      >
        <option value="">Select Blog</option>
        {blogs.map((blog: Blog) => (
          <option key={blog.id} value={blog.id}>{blog.title}</option>
        ))}
      </select>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={4}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Blog Inner' : 'Create Blog Inner')}
      </button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default BlogInnerForm;