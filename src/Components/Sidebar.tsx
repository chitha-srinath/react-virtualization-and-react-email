import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    BarChart2,
    Settings,
    LogOut,
    Users,
    Home
} from "lucide-react";
import { ROUTES } from "../constants/routes";

interface SidebarProps {
    user: {
        username?: string;
        email?: string;
    } | null | undefined;
    onLogout: () => void;
    isLoggingOut: boolean;
}

export function Sidebar({ user, onLogout, isLoggingOut }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
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
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </aside>
    );
}
