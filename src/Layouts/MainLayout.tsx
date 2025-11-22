import { Outlet, useLocation, Link } from "react-router";
import { useFetchUser, useLogout } from "../hooks";
import {
    LayoutDashboard,
    BarChart2,
    Settings,
    LogOut,
    Bell,
    Search,
    Users,
    Home
} from "lucide-react";
import { ROUTES } from "../constants/routes";

function MainLayout() {
    const location = useLocation();
    const { data: user } = useFetchUser();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col z-10">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">Nexus</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link
                        to={ROUTES.HOME}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(ROUTES.HOME)
                                ? "text-indigo-600 bg-indigo-50 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        Home
                    </Link>
                    <Link
                        to={ROUTES.DASHBOARD}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(ROUTES.DASHBOARD)
                                ? "text-indigo-600 bg-indigo-50 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        to={ROUTES.ABOUT}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(ROUTES.ABOUT)
                                ? "text-indigo-600 bg-indigo-50 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Users className="h-5 w-5" />
                        About
                    </Link>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                        <BarChart2 className="h-5 w-5" />
                        Analytics
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">
                            {location.pathname === "/" ? "Home" : location.pathname.replace("/", "")}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                                />
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="md:hidden">
                                {/* Mobile menu button placeholder */}
                                <button className="p-2 text-gray-600">
                                    <LayoutDashboard className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default MainLayout;
