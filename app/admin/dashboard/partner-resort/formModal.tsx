"use client";

import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";
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

interface Place {
  id: string;
  name: string;
}

interface ResortFormData {
  name: string;
  location: string;
  place: Place;
  image: File | null;
  price: string;
  is_featured: boolean;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResortFormData & { place_id: string }) => void;
  resortUuid: Resort | null;
}

export const FormModal: FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  resortUuid,
}) => {
  const initialFormState: ResortFormData = {
    name: "",
    location: "",
    place: {
      id: "",
      name: "",
    },
    image: null,
    price: "",
    is_featured: false,
  };

  const [formData, setFormData] = useState<ResortFormData>(initialFormState);

  useEffect(() => {
    if (resortUuid) {
      console.log(resortUuid);
      setFormData({
        name: resortUuid.name || "",
        location: resortUuid.location || "",
        place: {
          id: resortUuid.place.id || "",
          name: resortUuid.place.name || "",
        },
        image: null,
        price: resortUuid.price || "",
        is_featured: resortUuid.is_featured || false,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [resortUuid]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let place_id: string;

      if (resortUuid) {
        // For editing, use the existing place
        place_id = resortUuid.place.id;
      } else {
        // For new resorts, create a new place
        const placeResponse = await api.post(API_URL.PLACE.CREATE_PLACE, {
          name: formData.place.name,
          location: formData.location,
        });
        place_id = placeResponse.data.id;
      }

      const resortData = {
        ...formData,
        place_id,
      };

      onSubmit(resortData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {resortUuid ? "Edit Resort" : "Add New Resort"}
          </h2>
          <button
            onClick={() => {
              setFormData(initialFormState);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resort Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Enter the location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place
            </label>
            <input
              type="text"
              value={formData.place.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  place: {
                    ...prev.place,
                    name: e.target.value,
                  },
                }))
              }
              placeholder="Enter the place name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resort Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required={!resortUuid}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_featured: e.target.checked,
                }))
              }
              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
              Featured Resort
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormState);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {resortUuid ? "Update Resort" : "Add Resort"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
