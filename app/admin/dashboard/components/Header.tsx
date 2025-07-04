import React from "react";
import { FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-end px-8 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-xl text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center">
          <img
            src="https://cdn3.iconfinder.com/data/icons/user-group-black/100/user-process-512.png"
            alt="User Avatar"
            className="w-10 h-10"
          />
          <span className="font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
