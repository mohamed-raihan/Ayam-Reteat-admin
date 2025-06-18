import React, { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import BlogInnerForm from './Blog-innerForm';

export interface BlogCategory {
    id: number;
    title: string;
}

export interface BlogInner {
    id: number ;
    blog: number;
    blog_category: BlogCategory;
    blog_image: string;
    author: string;
    date: string;
    description: string;
    slug: string;
    time: string;
    title: string;
}

const BlogInnerTable = ({ blogInners, fetchBlogInners }: { blogInners: BlogInner[], fetchBlogInners: () => void }) => {
    // const [blogInners, setBlogInners] = useState<BlogInner[]>([]);
    // const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editData, setEditData] = useState<BlogInner | null>(null);
    const [showForm, setShowForm] = useState(false);

    //   const fetchBlogInners = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //       const [innerRes, blogsRes] = await Promise.all([
    //         api.get(API_URL.BLOG_INNER.GET_BLOG_INNER),
    //         api.get(API_URL.BLOGS.GET_BLOGS),
    //       ]);
    //       setBlogInners(innerRes.data);
    //       setBlogs(blogsRes.data);
    //     } catch (err) {
    //       setError('Failed to fetch Blog Inner data.');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    useEffect(() => {
        fetchBlogInners();
        // setBlogs(blogInners)
    }, []);

    const handleEdit = (item: BlogInner) => {
        setEditData(item);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this Blog Inner?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.delete(API_URL.BLOG_INNER.DELETE_BLOG_INNER(id));
            fetchBlogInners();
        } catch (err) {
            setError('Failed to delete Blog Inner.');
        } finally {
            setLoading(false);
        }
    };

    const getBlog = (blogId: string) => {
        return blogInners.find((b: BlogInner) => String(b.id) === String(blogId));
    };

    console.log(blogInners);
    

    return (
        <div className="p-6">
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="grid gap-4">
                {blogInners.length > 0 ? blogInners.map((item: BlogInner) => {
                    const blog = getBlog(item.blog.toString());
                    return (
                        <div key={item.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <img
                                src={blog?.blog_image || '/placeholder.png'}
                                alt={blog?.title || 'Blog'}
                                className="w-24 h-16 object-cover rounded-md mr-4 bg-gray-100"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{blog?.title || 'Unknown Blog'}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                    <span>Author: {blog?.author || '-'}</span>
                                    <span>Date: {blog?.date || '-'}</span>
                                </div>
                                <div className="mt-2 text-gray-700 whitespace-pre-line">{item.description}</div>
                            </div>
                            <div className="flex flex-col items-center space-y-2 ml-4">
                                <button
                                    className="p-2 text-gray-400 hover:text-purple-600"
                                    title="Edit"
                                    onClick={() => handleEdit(item)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-600"
                                    title="Delete"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    );
                }) : <div className="text-center text-gray-500">No blog inners found</div>}
            </div>
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                            onClick={() => { setShowForm(false); setEditData(null); }}
                        >
                            ×
                        </button>
                        <BlogInnerForm
                            editData={editData}
                            onSuccess={() => { setShowForm(false); setEditData(null); fetchBlogInners(); }}
                            onClose={() => { setShowForm(false); setEditData(null); }}
                            fetchBlogInners={fetchBlogInners}
                            setShowModal={setShowForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogInnerTable;
