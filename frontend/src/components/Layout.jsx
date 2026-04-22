import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, TrendingUp, Search, MonitorPlay, MessageSquare, Target, Flame, Clock, Wand2, Menu, X, Scissors, Calendar } from 'lucide-react';

export default function Layout({ children }) {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Shorts Repurposer', path: '/shorts', icon: <Scissors size={20} /> },
        { name: 'Content Calendar', path: '/calendar', icon: <Calendar size={20} /> },
        { name: 'Predictor', path: '/predict', icon: <TrendingUp size={20} /> },
        { name: 'SEO Studio', path: '/seo-studio', icon: <Search size={20} /> },
        { name: 'Sentiment', path: '/sentiment', icon: <MessageSquare size={20} /> },
        { name: 'Competitors', path: '/competitor', icon: <Target size={20} /> },
        { name: 'Trending', path: '/trends', icon: <Flame size={20} /> },
        { name: 'Best Time', path: '/best-time', icon: <Clock size={20} /> },
        { name: 'Advanced Lab', path: '/advanced-studio', icon: <Wand2 size={20} /> }
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 z-50">
                <Link to="/dashboard" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-2">
                    <MonitorPlay className="text-red-500" size={24} />
                    NextFrame
                </Link>
                <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white transition-colors">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col
                transition-transform duration-300 ease-in-out md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-2">
                        <MonitorPlay className="text-red-500" />
                        NextFrame
                    </h1>
                </div>
                <div className="flex-1 px-4 py-2 overflow-y-auto">
                    <p className="text-xs uppercase text-gray-500 font-bold mb-4 px-2">Menu</p>
                    <nav className="space-y-1">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium text-gray-300">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-black relative">
                <div className="absolute top-0 right-0 w-full max-w-[500px] aspect-square bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="p-4 md:p-8 relative z-10 w-full max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

