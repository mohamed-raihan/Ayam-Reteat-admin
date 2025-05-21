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

const navLinks = [
  { name: "Dashboard", icon: <FaTachometerAlt />, href: "/admin/dashboard" },
  {
    name: "User management",
    icon: <FaUsers />,
    href: "/admin/dashboard/users",
  },
  {
    name: "Refferals",
    icon: <FaBook />,
    href: "/admin/dashboard/referral",
  },
  {
    name: "Create Membership",
    icon: <FaTasks />,
    href: "/admin/dashboard/create-membership",
  },
  {
    name: "Partner Resort",
    icon: <FaUsers />,
    href: "/admin/dashboard/partner-resort",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white h-[100vh] w-64 flex flex-col border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Ayam Retret</h1>
        <nav className="space-y-2">
          {navLinks.map((link) => (
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
