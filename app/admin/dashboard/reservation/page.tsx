"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

// type User = {
//   name: string;
//   email: string;
//   status: "Successful" | "Pending" | "Overdue";
//   type: "Unassigned" | "Subscription";
//   signedUp: string;
//   avatar?: string;
//   verified?: boolean;
// };

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  find_us: string;  
}

const Referral = () => {
  const [search, setSearch] = useState("");
  const [reservation, setReservation] = useState<Reservation[]>([]);
//   const [filteredReservation, setFilteredReservation] = useState<Users[]>();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);


  console.log(selectedReservation);
  console.log(reservation);

  const fetchReservation = async () => {
    try {
      const response = await api.get(API_URL.CONTACT.GET_CONTACT);
      console.log(response);
      setReservation(response.data);
    } catch (error) {
      console.error(error);
    }
  };    
  // const filteredReferrals = referral.filter((referral) =>
  //   referral.name.toLowerCase().includes(search.toLowerCase())
  // );

  // setFilteredReferral(filteredReferrals);

  useEffect(() => {
    fetchReservation();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl  shadow-md">
      <div className="flex justify-between items-center bg-violet-500 mb-4 rounded-xl py-6 px-4">
        <h2 className="text-xl font-bold text-white ">Reservation</h2>
        <input
          type="text"
          placeholder="Search users"
          className="px-4 py-2 bg-violet-100 rounded-md focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm    ">
          <thead>
            <tr className="border-b text-gray-500 uppercase text-xs">
              <th className="py-3 px-2">ID</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Phone Number</th>
              <th className="py-3 px-2">Find Us</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="">
            {reservation?.length === 0 ? (
              <td colSpan={8} className="text-center pt-6 text-gray-500">
                No user found
              </td>
            ) : (
              reservation?.map((reservation, idx) => (
                <tr key={idx} className="hover:bg-gray-200">
                  <td className="py-3 px-2 text-gray-700">{idx + 1}</td>
                  <td className="py-3 px-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {reservation.name.charAt(0)}
                    </div>

                    <span className="font-medium flex items-center gap-1">
                      {reservation.name}
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
                  <td className="py-3 px-2 text-gray-700">{reservation.id}</td>
                  <td className="py-3 px-2 text-gray-700">{reservation.name}</td>
                  <td className="py-3 px-2 text-gray-700">{reservation.email}</td>
                  <td className="py-3 px-2 text-gray-700">{reservation.phone_number}</td>
                  <td className="py-3 px-2 text-gray-700">{reservation.find_us}</td>
                  <td className="py-3 px-2 text-gray-700">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setSelectedReservation(reservation)}
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
    </div>
  );
};

export default Referral;
