import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Target, TrendingDown, Lightbulb, Activity } from 'lucide-react';

export default function CompetitorAnalysis() {
    const [channelName, setChannelName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const analyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/competitor', { competitor_channel: channelName });
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to analyze competitor');
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">Competitor Analysis Engine</h2>
                <p className="text-gray-400 font-medium">Find the content gaps and conquer your niche.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="flex flex-col md:flex-row gap-4 max-w-2xl">
                    <input 
                        type="text" placeholder="Competitor's Channel Name"
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        value={channelName} onChange={e => setChannelName(e.target.value)} required 
                    />
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Target size={18} /> {loading ? 'Scanning...' : 'Analyze Channel'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-purple-500 blur-2xl"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <Activity className="text-purple-500" /> Gap Score
                        </h3>
                        <div className="flex items-end gap-3 text-purple-400">
                            <span className="text-6xl font-black">{result.gap_score}</span>
                            <span className="text-lg font-bold mb-2">/ 100</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-4">A higher score means more untouched content opportunities for your channel to capture their audience.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl relative">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <TrendingDown className="text-red-500" /> Missed Topics
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
                            <Lightbulb className="text-yellow-500" /> Strategic AI Recommendation
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
