import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Sparkles, CheckCircle2, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeoStudio() {
    const { hasChannel } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/seo', { title, topic });
            setResult(res.data);
        } catch (err) {
            alert('Failed to analyze SEO');
        }
        setLoading(false);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To perform data-driven SEO analysis tailored to your specific audience, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform active:scale-[0.98]"
                    >
                        Go to Dashboard to Connect
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                            <Sparkles size={28} />
                        </div>
                        SEO Optimizer
                    </h2>
                    <p className="text-gray-400 font-medium">Optimize your video title and discover the best tags to rank higher in YouTube search.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 border border-gray-800 bg-gray-900 rounded-3xl p-8 shadow-2xl h-fit relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                        <h3 className="text-xl font-bold text-white mb-6">Input Details</h3>
                        <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Current Video Title</label>
                                <textarea 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none shadow-inner"
                                    placeholder="e.g. My morning routine as a software engineer..." rows="3"
                                    value={title} onChange={e => setTitle(e.target.value)} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Channel Category / Topic</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner"
                                    placeholder="e.g. Productivity, Tech"
                                    value={topic} onChange={e => setTopic(e.target.value)} required 
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50">
                                {loading ? 'Analyzing with AI...' : <><Search size={20} /> Generate Optimization</>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        {!result && !loading && (
                            <div className="h-full min-h-[400px] border border-gray-800/40 bg-gray-900/40 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-gray-500 p-8 text-center border-dashed">
                                <Search size={64} className="mb-6 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Input</h3>
                                <p className="max-w-xs text-sm">Enter your title and topic to generate AI-driven SEO optimizations and score.</p>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="h-full min-h-[400px] bg-gray-900 rounded-3xl flex flex-col items-center justify-center border border-gray-800 shadow-2xl">
                                <Sparkles className="animate-pulse text-orange-500 mb-4" size={48} />
                                <span className="text-orange-400 font-bold text-lg">AI is finding the best tags...</span>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
                                    <div className="relative z-10">
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">SEO Strength</p>
                                        <h3 className="text-6xl font-black text-white">{result.seo_score}<span className="text-2xl text-gray-500 font-medium">/100</span></h3>
                                    </div>
                                    <div className="w-24 h-24 rounded-full border-8 border-green-500/20 flex items-center justify-center text-green-400 relative z-10 bg-green-500/10">
                                        <CheckCircle2 size={48} />
                                    </div>
                                </div>

                                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        🚀 Clickable Title Variations
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.better_titles.map((t, idx) => (
                                            <li key={idx} className="bg-gray-950 px-5 py-4 rounded-xl border border-gray-800 hover:border-gray-600 cursor-pointer transition-colors text-md font-semibold text-gray-200">
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        🏷️ Optimized Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {result.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 cursor-pointer transition-colors px-4 py-2 rounded-full text-sm font-bold border border-orange-500/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                                    <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                        💡 AI Insights
                                    </h4>
                                    <p className="text-blue-100 text-md leading-relaxed font-medium">{result.advice}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
