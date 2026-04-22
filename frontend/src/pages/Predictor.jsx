import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Activity, PlaySquare, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Predictor() {
    const { hasChannel } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('Entertainment');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/predict', { title, tags, category });
            setResult(res.data);
        } catch (err) {
            alert('Prediction failed');
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
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To predict video success based on your audience and niche, you must first link your YouTube handle.</p>
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
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                            <TrendingUp size={28} />
                        </div>
                        Success Predictor
                    </h2>
                    <p className="text-gray-400 font-medium">Evaluate the virality potential of your next video concepts.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                        <h3 className="text-xl font-bold text-white mb-6">Video Metadata</h3>
                        <form onSubmit={handlePredict} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Planned Title</label>
                                <input 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="I spent 50 hours coding..." 
                                    value={title} onChange={e => setTitle(e.target.value)} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Tags (comma separated)</label>
                                <textarea 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24"
                                    placeholder="coding, challenge, tech"
                                    value={tags} onChange={e => setTags(e.target.value)} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Category</label>
                                <select 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    value={category} onChange={e => setCategory(e.target.value)}>
                                    <option>Entertainment</option>
                                    <option>Education</option>
                                    <option>Gaming</option>
                                    <option>Tech / Gadgets</option>
                                    <option>Vlog</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50">
                                {loading ? 'Scanning Neural Network...' : 'Analyze Potential'}
                            </button>
                        </form>
                    </div>

                    <div className="h-full">
                        {!result && !loading && (
                            <div className="h-full min-h-[400px] border border-gray-800/40 bg-gray-900/40 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-gray-500 p-8 text-center border-dashed">
                                <Activity size={64} className="mb-6 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Waiting for Metadata</h3>
                                <p className="max-w-xs text-sm">Provide details to generate an engagement prediction score.</p>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="h-full min-h-[400px] bg-gray-900 rounded-3xl flex flex-col items-center justify-center border border-gray-800 shadow-2xl">
                                <Activity className="animate-bounce text-purple-500 mb-4" size={48} />
                                <span className="text-purple-400 font-bold text-lg">Predicting Virality...</span>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 h-full flex flex-col">
                                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex items-center justify-between overflow-hidden relative">
                                    <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
                                    <div className="relative z-10">
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Virality Score</p>
                                        <h3 className="text-6xl font-black text-white">{result.score}<span className="text-2xl text-gray-500 font-medium">/100</span></h3>
                                    </div>
                                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center text-purple-400 border border-gray-800 relative z-10">
                                        <PlaySquare size={32} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                                        <p className="text-gray-500 text-sm font-bold uppercase mb-2">Virality Class</p>
                                        <p className="text-2xl font-bold text-white">{result.virality}</p>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                                        <p className="text-gray-500 text-sm font-bold uppercase mb-2">Expected Views</p>
                                        <p className="text-2xl font-bold text-white">{result.expected_views}</p>
                                    </div>
                                </div>

                                <div className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 flex-1">
                                    <p className="text-sm font-bold uppercase text-purple-400 mb-3">Improvement Suggestions</p>
                                    <p className="text-purple-100 font-medium leading-relaxed">{result.improvements}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
