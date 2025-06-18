"use client";
import React, { useState } from "react";
import BlogCategoryForm from "../components/BlogCategoryForm";
import BlogHeadingForm from "../components/BlogHeadingForm";
import BlogCreateForm from "../components/BlogCreateForm";
import BlogList from "../components/BlogList";
import BlogCategoryTable from "../components/BlogCategoryTable";
import BlogHeadingTable from "../components/BlogHeadingTable";
import BlogInnerTable, { BlogCategory } from "../components/Blog-innerTable";
import BlogInnerForm from "../components/Blog-innerForm";
import { API_URL } from "@/app/services/api_url";
import api from "@/app/services/api";

const TABS = [
  { key: "categories", label: "Categories" },
  { key: "headings", label: "Headings" },
  { key: "blogs", label: "Blogs" },
  { key: "blogs inner", label: "Blogs Inner" },
];

interface Blog {
  id: number;
  title: string;
  content: string;
  category: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Heading {
  id: number;
  title: string;
  description?: string;
}

interface BlogInner {
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

export default function BlogManagementPage() {
  const [activeTab, setActiveTab] = useState("blogs");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [blogInners, setBlogInners] = useState<BlogInner[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const response = await api.get(API_URL.BLOGS.GET_BLOGS);
    setBlogs(response.data);
  };

  const fetchCategories = async () => {
    const response = await api.get(API_URL.BLOGS.GET_BLOG_CATEGORIES);
    setCategories(response.data);
  };

  const fetchHeadings = async () => {
    const response = await api.get(API_URL.BLOGS.GET_BLOG_HEADERS);
    setHeadings(response.data);
  };

  const fetchBlogInners = async () => {
    const response = await api.get(API_URL.BLOG_INNER.GET_BLOG_INNER);
    setBlogInners(response.data);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "blogs":
        return <BlogList  fetchBlogs={fetchBlogs} />;
      case "categories":
        return <BlogCategoryTable categories={categories} fetchCategories={fetchCategories} />;
      case "headings":
        return <BlogHeadingTable headings={headings} fetchHeadings={fetchHeadings} />;
      case "blogs inner":
        return <BlogInnerTable blogInners={blogInners} fetchBlogInners={fetchBlogInners} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      {/* Gradient Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Blog Management</h1>
        <p className="text-purple-100 mt-1">Manage your blogs, categories, and headings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow flex items-center px-6 py-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-colors rounded-t-lg ${
              activeTab === tab.key
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        {/* Floating Action Button */}
        {activeTab === "blogs" && (
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Blog
          </button>
        )}
        {activeTab === "categories" && (
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Category
          </button>
        )}
        {activeTab === "headings" && (
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Heading
          </button>
        )}
        {activeTab === "blogs inner" && (
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Blog Inner
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className=" mx-auto w-full">{renderTabContent()}</div>

      {/* Modal for Forms */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            {activeTab === "blogs" && <BlogCreateForm fetchCategories={fetchCategories} setShowModal={setShowModal}/>}
            {activeTab === "categories" && <BlogCategoryForm fetchCategories={fetchCategories} setShowModal={setShowModal} />}
            {activeTab === "headings" && <BlogHeadingForm fetchHeadings={fetchHeadings} setShowModal={setShowModal} />}
            {activeTab === "blogs inner" && <BlogInnerForm fetchBlogInners={fetchBlogInners} setShowModal={setShowModal} />}
          </div>
        </div>
      )}
    </div>
  );
} 