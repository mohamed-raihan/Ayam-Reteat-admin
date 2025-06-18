"use client";
import React from "react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";
import { toast } from "react-toastify";
import { TrashIcon } from "lucide-react";

const BlogCategoryTable = ({ categories, fetchCategories }: { categories: any[], fetchCategories: () => void }) => {
  const handleDelete = async (id: number) => {
    try {
      await api.delete(API_URL.BLOGS.DELETE_BLOG_CATEGORY(id.toString()));
      fetchCategories();
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category.');
    }
  };
  return (
    <div>
      {categories.length > 0 ? <div className="flex gap-2 w-full bg-white rounded-md px-4 py-2">
        {categories.map((cat: any) => (
          <div className="flex justify-between items-center rounded-md px-4 py-2 bg-white border border-gray-200 " key={cat.id}>
            <div>{cat.title}</div>
            <button className="text-red-500" onClick={() => handleDelete(cat.id)}><TrashIcon className="w-4 h-4" /></button>
          </div>
        ))}
      </div> : <div className="text-center text-gray-500">No categories found</div>}
    </div>
  );
};

export default BlogCategoryTable; 