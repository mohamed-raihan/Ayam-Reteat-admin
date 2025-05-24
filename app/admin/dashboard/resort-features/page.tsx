"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

interface Feature {
  name: string;
}

export default function ResortFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [properties, setProperties] = useState<Feature[]>([]);

  const [featureInput, setFeatureInput] = useState("");
  const [propertyInput, setPropertyInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const handleAdd = async (
    type: "feature" | "property",
    input: string,
    setter: React.Dispatch<React.SetStateAction<Feature[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (type === "feature") {
      try {
        const response = await api.post(API_URL.RESORT_FEATURES.CREATE_RESORT_FEATURES, { name: input });
        console.log(response, "response");
      } catch (error) {
        console.error("Error adding feature:", error);
      }
    } else {
      try {
        const response = await api.post(API_URL.RESORT_PROPERITIES.CREATE_RESORT_PROPERITIES, { name: input });
        console.log(response, "response");
      } catch (error) {
        console.error("Error adding property:", error);
      }
    }
  };

  const deleteFeature = async (id: string) => {
    try {
      const response = await api.delete(API_URL.RESORT_FEATURES.DELETE_RESORT_FEATURES(id));
      console.log(response, "response");
    } catch (error) {
      console.error("Error deleting feature:", error);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const response = await api.delete(API_URL.RESORT_PROPERITIES.DELETE_RESORT_PROPERITIES(id));
      console.log(response, "response");
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await api.get(API_URL.RESORT_FEATURES.GET_RESORT_FEATURES);
      console.log(response, "response");
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get(API_URL.RESORT_PROPERITIES.GET_RESORT_PROPERITIES);
      console.log(response, "response");
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchFeatures();
    fetchProperties();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Resort Features</h1>
      
      <div className="flex flex md:flex-row gap-8">
        {/* Features Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Features</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={() => handleAdd("feature", featureInput, setFeatures, setFeatureInput)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                {feature.name}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Properties</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a note"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={() => handleAdd("property", noteInput, setProperties, setNoteInput)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {properties.map((property, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                {property.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}