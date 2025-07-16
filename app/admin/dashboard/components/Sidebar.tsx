"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaBook,
  FaTasks,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSupervisedUserCircle } from "react-icons/md";
import { useState } from "react";

const navLinks = [
  { name: "Dashboard", icon: <FaTachometerAlt />, href: "/admin/dashboard" },
  {
    name: "Homepage",
    icon: <FaUsers />,
    href: "/admin/dashboard/homepage",
  },
  {
    name: "Contact Us",
    icon: <FaBook />,
    href: "/admin/dashboard/contact-us",
  },
  // {
  //   name: "About Us",
  //   icon: <FaBook />,
  //   href: "/admin/dashboard/about-us",
  // },
  {
    name: "Services",
    icon: <MdSupervisedUserCircle  />,
    href: "/admin/dashboard/service-management",
  },
  {
    name: "Study Abroad",
    icon: <FaTasks />,
    href: "/admin/dashboard/study-abroad",
  },
  {
    name: "Blogs",
    icon: <FaUsers />,
    href: "/admin/dashboard/blog-management",
  },
  {
    name: "SEO",
    icon: <FaTasks />,
    href: "/admin/dashboard/seo/homeseo",
  },
];

const seoSubLinks = [
  { name: "Home SEO", href: "/admin/dashboard/seo/homeseo" },
  { name: "Services SEO", href: "/admin/dashboard/seo/serviceseo" },
  { name: "Blog SEO", href: "/admin/dashboard/seo/blogseo" },
  { name: "Contact SEO", href: "/admin/dashboard/seo/contactseo" },
  { name: "Study Abroad SEO", href: "/admin/dashboard/seo/countryseo" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [seoOpen, setSeoOpen] = useState(false);

  return (
    <aside className="bg-white h-[100vh] w-64 flex flex-col border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">What Next</h1>
        <nav className="space-y-2">
          {navLinks.filter(link => link.name !== "SEO").map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition ${
                pathname === link.href
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : ""
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </a>
          ))}
          <div>
            <button
              type="button"
              onClick={() => setSeoOpen((open) => !open)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-gray-700 hover:bg-blue-50 transition ${
                seoSubLinks.some(sub => pathname === sub.href)
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : ""
              }`}
            >
              <span className="text-lg"><FaTasks /></span>
              SEO
              <span className="ml-auto text-xs">{seoOpen ? "▲" : "▼"}</span>
            </button>
            {seoOpen && (
              <div className="ml-7 mt-1 space-y-1">
                {seoSubLinks.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.href}
                    className={`block px-2 py-1 rounded text-sm transition ${
                      pathname === sub.href
                        ? "bg-blue-200 text-blue-900 font-semibold"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="mt-auto space-y-2">
        {/* <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition"
        >
          <FaCog className="text-lg" /> Setting
        </a> */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </Link>
      </div>
    </aside>
  );
}
