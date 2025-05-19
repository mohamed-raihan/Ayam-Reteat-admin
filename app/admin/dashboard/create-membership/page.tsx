"use client";

import { FC, useEffect, useState } from "react";
import { Check, Edit2, Plus, X } from "lucide-react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

interface Benefit {
  benefit_text: string;
}

interface MembershipFormData {
  name: string;
  amount: string;
  description: string;
  is_popular: boolean;
  limited_offer: boolean;
  referral_limit: string;
  benefits: Benefit[];
}

const MembershipCard: FC = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState<Record<string, string>>({
    gold: "",
    platinum: "",
  });
  const [formData, setFormData] = useState<Record<string, MembershipFormData>>({
    gold: {
      name: "gold",
      amount: "",
      description: "",
      is_popular: false,
      limited_offer: false,
      referral_limit: "",
      benefits: [],
    },
    platinum: {
      name: "platinum",
      amount: "",
      description: "",
      is_popular: false,
      limited_offer: false,
      referral_limit: "",
      benefits: [],
    },
  });

  const fetchMembership = async () => {
    try {
      const response = await api.get(API_URL.MEMBERSHIP.GET_MEMBERSHIP);
      console.log("Response:", response);
      if (response.data) {
        setMemberships(response.data);
        // Update form data with existing membership data
        response.data.forEach((membership: any) => {
          setFormData((prev) => ({
            ...prev,
            [membership.name.toLowerCase()]: {
              ...membership,
              name: membership.name.toLowerCase(),
              benefits: Array.isArray(membership.benefits)
                ? membership.benefits
                : [],
            },
          }));
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (planType: string) => {
    try {
      const data = {
        ...formData[planType],
        referral_limit: parseInt(formData[planType].referral_limit) || 0,
      };
      const response = await api.post(
        API_URL.MEMBERSHIP.CREATE_MEMBERSHIP,
        data
      );
      console.log("Response:", response);
      setEditingPlan(null);
      fetchMembership();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addBenefit = (planType: string) => {
    if (newBenefit[planType].trim()) {
      setFormData((prev) => ({
        ...prev,
        [planType]: {
          ...prev[planType],
          benefits: [
            ...prev[planType].benefits,
            { benefit_text: newBenefit[planType].trim() },
          ],
        },
      }));
      setNewBenefit((prev) => ({
        ...prev,
        [planType]: "",
      }));
    }
  };

  const removeBenefit = (planType: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [planType]: {
        ...prev[planType],
        benefits: prev[planType].benefits.filter((_, i) => i !== index),
      },
    }));
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  const renderForm = (planType: string) => {
    const data = formData[planType];
    const isEditing = editingPlan === planType;

    return (
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {planType} Membership
          </h2>
          {!isEditing && (
            <button
              onClick={() => setEditingPlan(planType)}
              className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
            >
              <Edit2 className="h-5 w-5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(planType);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={data.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [planType]: { ...prev[planType], amount: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              disabled={!isEditing}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [planType]: {
                    ...prev[planType],
                    description: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={3}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`is_popular_${planType}`}
                checked={data.is_popular}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [planType]: {
                      ...prev[planType],
                      is_popular: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                disabled={!isEditing}
              />
              <label
                htmlFor={`is_popular_${planType}`}
                className="ml-2 text-sm text-gray-700"
              >
                Popular Plan
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`limited_offer_${planType}`}
                checked={data.limited_offer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [planType]: {
                      ...prev[planType],
                      limited_offer: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                disabled={!isEditing}
              />
              <label
                htmlFor={`limited_offer_${planType}`}
                className="ml-2 text-sm text-gray-700"
              >
                Limited Time Offer
              </label>
            </div>
          </div>

          {planType === "gold" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Limit
              </label>
              <input
                type="number"
                value={data.referral_limit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [planType]: {
                      ...prev[planType],
                      referral_limit: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={!isEditing}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefits
            </label>
            <div className="space-y-2">
              {data.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md">
                    {benefit.benefit_text}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(planType, index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefit[planType]}
                    onChange={(e) =>
                      setNewBenefit((prev) => ({
                        ...prev,
                        [planType]: e.target.value,
                      }))
                    }
                    placeholder="Add a new benefit"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => addBenefit(planType)}
                    className="px-3 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-violet-500 mb-4 rounded-xl py-6 px-4">
        <h2 className="text-xl font-bold text-white">Membership Plans</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderForm("gold")}
        {renderForm("platinum")}
      </div>
    </div>
  );
};

export default MembershipCard;
