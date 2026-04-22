import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Target, TrendingDown, Lightbulb, Activity, MonitorPlay, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompetitorAnalysis() {
    const { hasChannel } = useContext(AuthContext);
    const [channelInput, setChannelInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const analyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/competitor', { competitor_channel: channelInput });
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to analyze channel');
        }
        setLoading(false);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To compare channels and find untouched content opportunities, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98]"
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
                <h2 className="text-3xl font-bold mb-2">Channel Comparison</h2>
                <p className="text-gray-400 font-medium">Find content gaps and get ahead in your category by comparing with similar channels.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-400">
                        Enter Channel URL, Channel ID, or Handle
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Link2 size={18} className="text-gray-500" />
                            </div>
                            <input 
                                type="text"
                                placeholder="e.g. @MrBeast or UCX6OQ... or https://youtube.com/@MrBeast"
                                className="w-full pl-11 pr-4 bg-gray-950 border border-gray-700 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                value={channelInput} onChange={e => setChannelInput(e.target.value)} required 
                            />
                        </div>
                        <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                            <Target size={18} /> {loading ? 'Scanning...' : 'Compare Channel'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                        ✅ You can paste: <span className="text-gray-400">@MrBeast</span> · <span className="text-gray-400">UCX6OQ3DkcsbYNE6H8uQQuVA</span> · <span className="text-gray-400">https://youtube.com/channel/UCX6...</span>
                    </p>
                </form>
            </div>

            {loading && (
                <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-3xl">
                    <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-bold text-lg">AI is analyzing the channel...</p>
                </div>
            )}

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-purple-500 blur-2xl"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <Activity className="text-purple-500" /> Opportunity Score
                        </h3>
                        <div className="flex items-end gap-3 text-purple-400">
                            <span className="text-6xl font-black">{result.gap_score}</span>
                            <span className="text-lg font-bold mb-2">/ 100</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-4">A higher score means more untouched content opportunities for your channel to capture their audience.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <TrendingDown className="text-red-500" /> Topics They're Missing
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {result.missed_topics?.map((topic, i) => (
                                <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-sm font-semibold">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <Lightbulb className="text-yellow-500" /> Your Action Plan
                        </h3>
                        <p className="text-gray-300 leading-relaxed bg-gray-950 p-6 rounded-xl border border-gray-800">
                            {result.recommendations}
                        </p>
                    </div>
                </div>
            )}
        </Layout>
    );
}
