import { useFetchUser } from "../hooks";
import { CalendarWithSelect } from "@/Components/calendar-with-select";
import {
  User,
  Calendar as CalendarIcon,
  Activity,
} from "lucide-react";

function Dashboard() {
  // Fetch user data for the dashboard view
  const { data: user, isLoading: isLoadingUser, error: userError } = useFetchUser();

  if (isLoadingUser) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Error loading user data. Please try logging in again.</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl font-medium text-gray-800">Welcome back, {user?.username}!</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Sessions</p>
            <h3 className="text-2xl font-bold text-gray-900">1</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Days Active</p>
            <h3 className="text-2xl font-bold text-gray-900">14</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Profile Status</p>
            <h3 className="text-2xl font-bold text-gray-900">Verified</h3>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Profile Information
              </h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Username</label>
                <p className="text-gray-900 font-medium">{user?.username}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Role</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                  {user?.role}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User ID</label>
                <p className="text-gray-500 text-sm font-mono truncate" title={user?.id}>{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Logged in successfully</p>
                  <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                </div>
              </div>
              {/* Dummy items */}
              <div className="flex items-start gap-4 py-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Updated profile settings</p>
                  <p className="text-xs text-gray-500 mt-0.5">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-indigo-500" />
                Calendar
              </h3>
            </div>
            <div className="p-4 flex justify-center">
              <CalendarWithSelect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
