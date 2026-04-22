import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Flame, Zap, Hash, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrendingIdeas() {
    const { hasChannel } = useContext(AuthContext);
    const [niche, setNiche] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const analyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/trends', { niche });
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to fetch trending ideas');
        }
        setLoading(false);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To discover trending topics and viral ideas personalized for your brand, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform active:scale-[0.98]"
                    >
                        Go to Dashboard to Connect
                    </Link>
                </div>
            </Layout>
        );
    }

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To discover trending topics and viral ideas personalized for your brand, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform active:scale-[0.98]"
                    >
                        Go to Dashboard to Connect
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">Trending Ideas Engine</h2>
                <p className="text-gray-400 font-medium">Discover what's going viral right now in your specific niche.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="flex flex-col md:flex-row gap-4 max-w-2xl">
                    <input 
                        type="text" placeholder="Channel Category (e.g., Tech Reviews, Fitness, Comedy)"
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                        value={niche} onChange={e => setNiche(e.target.value)} required 
                    />
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Flame size={18} /> {loading ? 'Scanning Trends...' : 'Find Trends'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-orange-500 blur-2xl"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <Hash className="text-orange-500" /> Trending Topics
                        </h3>
                        <ul className="space-y-3">
                            {result.trending_topics?.map((topic, i) => (
                                <li key={i} className="bg-gray-950 border border-gray-800 px-4 py-3 rounded-lg text-gray-300 font-medium flex items-center gap-3">
                                    <span className="text-orange-500 font-black">#{i+1}</span> {topic}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-amber-500 blur-2xl"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <Zap className="text-amber-500" /> Viral Video Ideas
                        </h3>
                        <ul className="space-y-3">
                            {result.viral_ideas?.map((idea, i) => (
                                <li key={i} className="bg-gray-950 border border-gray-800 px-4 py-3 rounded-lg text-amber-50 font-semibold group hover:border-amber-500/50 transition-colors">
                                    {idea}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
}
