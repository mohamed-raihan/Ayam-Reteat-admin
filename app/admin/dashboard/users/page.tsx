"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";
import { UserProfile } from "@/app/admin/dashboard/components/UserProfile";

type User = {
  name: string;
  email: string;
  status: "Successful" | "Pending" | "Overdue";
  type: "Unassigned" | "Subscription";
  signedUp: string;
  avatar?: string;
  verified?: boolean;
};

interface Users {
  id: string;
  uuid: string;
  full_name: string;
  name: string;
  phone_number: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  points: number;
  referral_code: string;
  created_at: string;
}

const users: User[] = [
  {
    name: "Amanda Harvey",
    email: "amanda@site.com",
    status: "Successful",
    type: "Unassigned",
    signedUp: "1 year ago",
    avatar: "/avatar1.png",
    verified: true,
  },
  {
    name: "Rachel Doe",
    email: "rachel@site.com",
    status: "Pending",
    type: "Unassigned",
    signedUp: "6 months ago",
    avatar: "",
  },
  {
    name: "Costa Quinn",
    email: "costa@site.com",
    status: "Overdue",
    type: "Unassigned",
    signedUp: "1 year ago",
    avatar: "",
  },
  {
    name: "Anna Richard",
    email: "anne@site.com",
    status: "Successful",
    type: "Subscription",
    signedUp: "6 months ago",
    avatar: "",
  },
  {
    name: "Bob Dean",
    email: "bob@site.com",
    status: "Successful",
    type: "Subscription",
    signedUp: "6 months ago",
    avatar: "",
  },
  {
    name: "Mark Colbert",
    email: "mark@site.com",
    status: "Successful",
    type: "Subscription",
    signedUp: "6 months ago",
    avatar: "",
  },
  {
    name: "Finch Hoot",
    email: "finch@site.com",
    status: "Pending",
    type: "Subscription",
    signedUp: "1 year ago",
    avatar: "",
  },
  {
    name: "Ella Lauda",
    email: "ella@site.com",
    status: "Pending",
    type: "Subscription",
    signedUp: "1 year ago",
    avatar: "/avatar2.png",
    verified: true,
  },
];

const statusColorMap = {
  Successful: "text-green-600",
  Pending: "text-yellow-500",
  Overdue: "text-red-600",
};

const statusDotColor = {
  Successful: "bg-green-500",
  Pending: "bg-yellow-500",
  Overdue: "bg-red-500",
};

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUser, setFilteredUser] = useState<Users[]>();
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get(API_URL.USER.GET_USERS);
      console.log(response);
      setFilteredUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl  shadow-md">
      <div className="flex justify-between items-center bg-violet-500 mb-4 rounded-xl py-6 px-4">
        <h2 className="text-xl font-bold text-white ">Users</h2>
        <input
          type="text"
          placeholder="Search users"
          className="px-4 py-2 bg-violet-100 rounded-md focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500 uppercase text-xs">
              <th className="py-3 px-2">Full Name</th>
              <th className="py-3 px-2">DOB</th>
              <th className="py-3 px-2">Phone</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Gender</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="">
            {filteredUser?.length === 0 ? (
              <td colSpan={5} className="text-center pt-6 text-gray-500">
                No user found
              </td>
            ) : (
              filteredUser?.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-200">
                  <td className="py-3 px-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {user.full_name.charAt(0)}
                    </div>

                    <span className="font-medium flex items-center gap-1">
                      {user.full_name}
                      {/* {user.verified && (
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )} */}
                    </span>
                  </td>
                  <td className="py-3 px-2">{user.dob}</td>
                  <td className="py-3 px-2 text-gray-700">
                    {user.phone_number}
                  </td>
                  <td className="py-3 px-2 text-gray-700">{user.email}</td>
                  <td className="py-3 px-2 text-gray-700">{user.gender}</td>
                  <td className="py-3 px-2 text-gray-700">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserProfile
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserTable;
