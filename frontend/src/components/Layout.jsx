import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, TrendingUp, Search, MonitorPlay, MessageSquare, Target, Flame, Clock, Wand2 } from 'lucide-react';

export default function Layout({ children }) {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Predictor', path: '/predict', icon: <TrendingUp size={20} /> },
        { name: 'SEO Studio', path: '/seo-studio', icon: <Search size={20} /> },
        { name: 'Sentiment', path: '/sentiment', icon: <MessageSquare size={20} /> },
        { name: 'Competitors', path: '/competitor', icon: <Target size={20} /> },
        { name: 'Trending', path: '/trends', icon: <Flame size={20} /> },
        { name: 'Best Time', path: '/best-time', icon: <Clock size={20} /> },
        { name: 'Advanced Lab', path: '/advanced-studio', icon: <Wand2 size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-2">
                        <MonitorPlay className="text-red-500" />
                        NextFrame
                    </h1>
                </div>
                <div className="px-4 py-2">
                    <p className="text-xs uppercase text-gray-500 font-bold mb-4">Menu</p>
                    <nav className="space-y-1">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                                    {item.icon}
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-sm">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold truncate max-w-[140px]">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium text-gray-300">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto bg-black relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="p-8 relative z-10 w-full max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
