"use client";

import { FC, useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import { FormModal } from "./formModal";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

interface Resort {
  id: string;
  uuid: string;
  name: string;
  location: string;
  place: {
    id: string;
    name: string;
  };
  image: string;
  price: string;
  is_featured: boolean;
}

interface ResortFormData {
  name: string;
  location: string;
  place: {
    id: string;
    name: string;
  };
  image: File | null;
  price: string;
  is_featured: boolean;
}

const PartnerResort: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  const fetchResorts = async () => {
    try {
      const response = await api.get(API_URL.PARTNER_RESORT.GET_PARTNER_RESORT);
      setResorts(response.data);
    } catch (error) {
      console.error("Error fetching resorts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resort: Resort) => {
    setShowModal(true);
    setSelectedResort(resort);
  };

  const handleSubmit = async (data: ResortFormData & { place_id: string }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      if (selectedResort) {
        // Update existing resort
        await api.put(
          `${API_URL.PARTNER_RESORT.UPDATE_PARTNER_RESORT}/${selectedResort.uuid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new resort
        await api.post(API_URL.PARTNER_RESORT.CREATE_PARTNER_RESORT, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchResorts();
      setShowModal(false);
      setSelectedResort(null);
    } catch (error) {
      console.error("Error saving resort:", error);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center bg-violet-500 mb-4 rounded-xl py-6 px-4">
        <h2 className="text-xl font-bold text-white">Partner Resorts</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setSelectedResort(null);
          }}
          className="bg-white p-2 rounded-lg shadow-stone-200 shadow-2xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Resort</span>
        </button>
      </div>

      <FormModal
        resortUuid={selectedResort}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-48 object-cover"
                />
                {resort.is_featured && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-400 text-black text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {resort.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{resort.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-violet-600">
                    ₹{resort.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      handleEdit(resort);
                    }}
                    className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerResort;
