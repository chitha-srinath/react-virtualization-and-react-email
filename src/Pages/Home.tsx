import { CalendarWithSelect } from "@/Components/calendar-with-select";
import { useFetchUser } from "../hooks/useAuthQueries";

function Home() {
  const { data: user, isLoading, error } = useFetchUser();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">Loading user information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-600">Error loading user: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Home</h1>
          <p className="text-gray-500 mt-2">This is your home page overview.</p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user?.username}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.id}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Recent Activity
              </h3>
              <p className="text-gray-600">No recent activity to display.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No user information available.</p>
          </div>
        )}
      </div>
      <div className="mt-8 text-center w-fit">
        <CalendarWithSelect />
      </div>
    </div>
  );
}

export default Home;
