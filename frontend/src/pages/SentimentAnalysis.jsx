import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SentimentAnalysis() {
    const { hasChannel } = useContext(AuthContext);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const analyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/ai/sentiment', { video_url: videoUrl });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to analyze viewer feedback.");
        }
        setLoading(false);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To analyze viewer feedback and understand what your audience really thinks, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98]"
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
                <h2 className="text-3xl font-bold mb-2">Viewer Feedback</h2>
                <p className="text-gray-400 font-medium">Instantly understand what your viewers really feel about your video.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="flex flex-col md:flex-row gap-4 max-w-3xl">
                    <input 
                        type="text" 
                        placeholder="Paste YouTube Video URL here..."
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                        value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required 
                    />
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <MessageSquare size={18} />
                        {loading ? 'Analyzing...' : 'Analyze Comments'}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4 text-sm font-semibold">{error}</p>}
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl bg-green-500"></div>
                         <ThumbsUp className="text-green-500 mb-4" size={32} />
                         <p className="text-4xl font-extrabold text-white mb-1">{result.positive}%</p>
                         <p className="text-gray-400 font-semibold text-sm uppercase">Positive</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl bg-red-500"></div>
                         <ThumbsDown className="text-red-500 mb-4" size={32} />
                         <p className="text-4xl font-extrabold text-white mb-1">{result.negative}%</p>
                         <p className="text-gray-400 font-semibold text-sm uppercase">Negative</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl bg-gray-500"></div>
                         <Minus className="text-gray-500 mb-4" size={32} />
                         <p className="text-4xl font-extrabold text-white mb-1">{result.neutral}%</p>
                         <p className="text-gray-400 font-semibold text-sm uppercase">Neutral</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="text-orange-500">✨</span> AI Summary</h3>
                    <div className="text-gray-300 leading-relaxed font-medium bg-gray-950 p-6 rounded-xl border border-gray-800 whitespace-pre-wrap">
                        {result.summary}
                    </div>
                </div>
            )}
        </Layout>
    );
}
