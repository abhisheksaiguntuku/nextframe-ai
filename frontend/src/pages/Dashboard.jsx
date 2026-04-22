import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonitorPlay, Users, Eye, Video } from 'lucide-react';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [handle, setHandle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/channel/dashboard').then(res => setData(res.data)).catch(() => setData(null));
    }, []);

    const connectChannel = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/channel/connect', { channel_handle: handle });
            const res = await api.get('/channel/dashboard');
            setData(res.data);
        } catch (err) {
            alert('Failed to connect channel. Ensure handle is correct.');
        }
        setLoading(false);
    };

    if (!data) return <Layout><div className="text-gray-400">Loading dash...</div></Layout>;

    if (!data.has_channel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Link your YouTube channel to unlock AI-powered analytics, growth tools, and your personalized content strategy.</p>
                    <form onSubmit={connectChannel} className="space-y-3 max-w-md mx-auto">
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                placeholder="@handle, Channel ID, or YouTube URL"
                                className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                                value={handle} onChange={e => setHandle(e.target.value)} required 
                            />
                            <button type="submit" disabled={loading} className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50">
                                {loading ? '...' : 'Connect'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 text-left font-medium">
                            ✅ Accepted: <span className="text-gray-400">@MrBeast</span> · <span className="text-gray-400">UCX6OQ3Dkcs...</span> · <span className="text-gray-400">https://youtube.com/@MrBeast</span>
                        </p>
                    </form>
                </div>
            </Layout>
        )
    }

    const c = data.channel_data;
    const mockGraph = [
        { name: 'Mon', views: c.view_count - 45000 },
        { name: 'Tue', views: c.view_count - 35000 },
        { name: 'Wed', views: c.view_count - 20000 },
        { name: 'Thu', views: c.view_count - 5000 },
        { name: 'Fri', views: c.view_count },
    ];

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-gray-700 transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-all ${color.split(' ')[0]}`}></div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h4 className="text-3xl font-bold text-white mb-1 tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Performance Dashboard</h2>
                    <p className="text-gray-400 font-medium">Realtime overview for <span className="text-red-400 font-semibold">{c.handle}</span></p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                     <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20 font-semibold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Channel Synced
                     </div>
                     <button 
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to disconnect this channel?")) {
                                try {
                                    await api.delete('/channel/connect');
                                    window.location.reload();
                                } catch (e) {
                                    alert("Failed to disconnect");
                                }
                            }
                        }}
                        className="bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-gray-700 hover:border-red-500/30"
                     >
                        Disconnect
                     </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Subscribers" value={c.subscriber_count} icon={<Users size={24} />} color="bg-blue-500 text-blue-100" />
                <StatCard title="Total Views" value={c.view_count} icon={<Eye size={24} />} color="bg-orange-500 text-orange-100" />
                <StatCard title="Videos" value={c.video_count} icon={<Video size={24} />} color="bg-purple-500 text-purple-100" />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-1">View Growth Simulator</h3>
                    <p className="text-sm text-gray-500">Trailing 5 days mock progression based on current metrics</p>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockGraph}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12, fontWeight: 600}} axisLine={{stroke: '#333'}} />
                            <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12, fontWeight: 600}} axisLine={false} tickFormatter={tick => (tick / 1000).toFixed(0) + 'k'} />
                            <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', fontWeight: 'bold'}} itemStyle={{color: '#fff'}} />
                            <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={4} dot={{r: 6, fill: '#111', strokeWidth: 3, stroke: '#ef4444'}} activeDot={{r: 8, fill: '#ef4444'}} animationDuration={1500} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
}
