"use client";

import { FC, useState, useEffect } from "react";
import { User, Star, Plus, Minus, History, X } from "lucide-react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

interface UserProfileProps {
  user: {
    uuid: string;
    id: string;
    full_name: string;
    email: string;
    points: number;
    referral_code: string;
    created_at: string;
  };
  onClose: () => void;
}

interface PointHistory {
  user_uuid: string;
  id: string;
  points: number;
  reason: string;
  created_at: string;
}

interface ReferralUser {
  name: string;
  email: string;
  phone_number: string;
}

export const UserProfile: FC<UserProfileProps> = ({ user, onClose }) => {
  const [points, setPoints] = useState<number>(user.points);
  const [pointAmount, setPointAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userReferral, setUserReferral] = useState<any>(null);

  const calculateTotalPoints = (history: PointHistory[]) => {
    console.log(history);
    return history.reduce(
      (sum: number, history: PointHistory) => sum + Number(history.points),
      0
    );
  };

  const fetchPointHistory = async () => {
    try {
      const response = await api.get(API_URL.REFERRAL.ADD_POINT);
      const filteredPointHistory = response.data.filter(
        (history: PointHistory) => history.user_uuid === user.uuid
      );
      setPointHistory(filteredPointHistory);
      const totalPoints = calculateTotalPoints(filteredPointHistory);
      setPoints(totalPoints);
    } catch (error) {
      console.error("Error fetching point history:", error);
    }
  };

  const fetchUserReferral = async () => {
    try {
      const response = await api.get(
        `${API_URL.REFERRAL.GET_REFERRAL_BY_ID}?user_uuid=${user.uuid}`
      );
      console.log(response.data);
      setUserReferral(response.data);
    } catch (error) {
      console.error("Error fetching user referral:", error);
    }
  };

  useEffect(() => {
    fetchPointHistory();
    fetchUserReferral();
  }, [user.uuid]);

  const handleAddPoints = async () => {
    if (!pointAmount) return;
    setIsLoading(true);
    try {
      const response = await api.post(API_URL.REFERRAL.ADD_POINT, {
        user_uuid: user.uuid,
        points: parseInt(pointAmount),
        reason: reason || "Points added by admin",
      });

      const updatedHistory = [...pointHistory, response.data];
      setPointHistory(updatedHistory);
      const newTotal = calculateTotalPoints(updatedHistory);
      setPoints(newTotal);
      setPointAmount("");
      setReason("");
    } catch (error) {
      console.error("Error adding points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeductPoints = async () => {
    if (!pointAmount) return;
    setIsLoading(true);
    try {
      const response = await api.post(
        API_URL.REFERRAL.DEDUCT_POINT(user.uuid),
        {
          points: -parseInt(pointAmount), // Make points negative for deduction
          reason: reason || "Points deducted by admin",
        }
      );

      const updatedHistory = [...pointHistory, response.data];
      setPointHistory(updatedHistory);
      const newTotal = calculateTotalPoints(updatedHistory);
      setPoints(newTotal);
      setPointAmount("");
      setReason("");
    } catch (error) {
      console.error("Error deducting points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-violet-100 p-3 rounded-full">
                <User className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.full_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Points Balance</span>
                <span className="text-2xl font-bold text-violet-600">
                  {points}
                </span>
              </div>
              {/* <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Referral Code</span>
                <span className="font-medium text-gray-800">
                  {user.referral_code}
                </span>
              </div> */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-800">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Referrals Section */}
            <div className="bg-white rounded-lg p-6 mt-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2 shadow">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Referred Users
                </h3>
              </div>
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {userReferral && userReferral.length > 0 ? (
                  userReferral.map((referral: ReferralUser, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {referral.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {referral.email}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {referral.phone_number}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No referrals yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Points Management Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Manage Points
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points Amount
                  </label>
                  <input
                    type="number"
                    value={pointAmount}
                    onChange={(e) => setPointAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter points"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddPoints}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Points
                  </button>
                  <button
                    onClick={handleDeductPoints}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Minus className="h-4 w-4" />
                    Deduct Points
                  </button>
                </div>
              </div>
            </div>

            {/* Points History */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2 shadow">
                <History className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Points History
                </h3>
              </div>
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {pointHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {history.reason}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(history.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`font-semibold ${
                        history.points > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {history.points > 0 ? "+" : ""}
                      {history.points}
                    </span>
                  </div>
                ))}
                {pointHistory.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No points history yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
