import React from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-violet-500 rounded-2xl p-8 text-white flex items-center justify-between shadow-md">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Sharpen Your Skills with Professional Online Courses
          </h2>
          <button className="mt-4 px-6 py-2 bg-white text-violet-600 font-semibold rounded-lg shadow hover:bg-violet-50 transition">
            Join Now
          </button>
        </div>
        <div className="hidden md:block">
          {/* Decorative graphic or illustration can go here */}
          <span className="text-6xl">✨</span>
        </div>
      </div>

      {/* Placeholder for course categories */}
      {/* <div className="flex gap-4">
        <div className="bg-white rounded-xl px-6 py-4 shadow text-center flex-1">
          <div className="text-xs text-gray-400 mb-1">2/8 watched</div>
          <div className="font-semibold">UI/UX Design</div>
        </div>
        <div className="bg-white rounded-xl px-6 py-4 shadow text-center flex-1">
          <div className="text-xs text-gray-400 mb-1">3/8 watched</div>
          <div className="font-semibold">Branding</div>
        </div>
        <div className="bg-white rounded-xl px-6 py-4 shadow text-center flex-1">
          <div className="text-xs text-gray-400 mb-1">6/12 watched</div>
          <div className="font-semibold">Front End</div>
        </div>
      </div> */}

      {/* Continue Watching */}
      {/* <div>
        <h3 className="text-lg font-semibold mb-4">Continue Watching</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="h-32 bg-gray-200 rounded mb-3" />
            <div className="text-xs text-blue-600 font-bold mb-1">
              FRONT END
            </div>
            <div className="font-semibold mb-1">
              Beginner's Guide to Becoming a Professional Front-End Developer
            </div>
            <div className="text-xs text-gray-400">
              Leonardo samsul • Mentor
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="h-32 bg-gray-200 rounded mb-3" />
            <div className="text-xs text-violet-600 font-bold mb-1">
              UI/UX DESIGN
            </div>
            <div className="font-semibold mb-1">
              Optimizing User Experience with the Best UI/UX Design
            </div>
            <div className="text-xs text-gray-400">Bayu Salto • Mentor</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="h-32 bg-gray-200 rounded mb-3" />
            <div className="text-xs text-pink-600 font-bold mb-1">BRANDING</div>
            <div className="font-semibold mb-1">
              Reviving and Refreshing Company Image
            </div>
            <div className="text-xs text-gray-400">Padhang Satrio • Mentor</div>
          </div>
        </div>
      </div> */}

      {/* Statistics and Mentors (right sidebar in image, but here as sections) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Statistic</h4>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center text-3xl">
              🙂
            </div>
            <div>
              <div className="font-bold text-lg">Good Morning Jason 🔥</div>
              <div className="text-xs text-gray-400 mb-2">
                Continue your learning to achieve your target!
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-16 bg-violet-400 rounded"></div>
                <div className="w-8 h-24 bg-violet-300 rounded"></div>
                <div className="w-8 h-12 bg-violet-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Your mentor</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                🧑‍🏫
              </span>
              <span className="flex-1">Padhang Satrio</span>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold">
                Follow
              </button>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                🧑‍🏫
              </span>
              <span className="flex-1">Zakir Horizontal</span>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold">
                Follow
              </button>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                🧑‍🏫
              </span>
              <span className="flex-1">Leonardo Samsul</span>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold">
                Follow
              </button>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
}
