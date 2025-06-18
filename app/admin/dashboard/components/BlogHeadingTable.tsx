"use client";
// import React, { useEffect, useState } from "react";
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';
import { toast } from "react-toastify";
import { TrashIcon } from "lucide-react";

interface Heading {
  id: number;
  title: string;
  description?: string;
}

const BlogHeadingTable = ({ headings, fetchHeadings }: { headings: Heading[], fetchHeadings: () => void }) => {

    const handleDelete = async (id: number) => {
        await api.delete(API_URL.BLOGS.DELETE_BLOG_HEADERS(id.toString()));
        fetchHeadings();
        toast.success('Heading deleted successfully!');
    };

  return (
    <div>
      {headings.length > 0 ? <div className="flex gap-2 w-full bg-white rounded-md px-4 py-2">
        {headings.map((heading: Heading) => (
          <div className="flex justify-between items-center rounded-md px-4 py-2 bg-white border border-gray-200 w-fit" key={heading.id}>
            <div>{heading.title}</div>
            <button className="text-red-500" onClick={() => handleDelete(heading.id)}><TrashIcon className="w-4 h-4" /></button>
          </div>
        ))}
      </div> : <div className="text-center text-gray-500">No headings found</div>}
    </div>
  );
};

export default BlogHeadingTable;