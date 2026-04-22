import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, Calendar, CheckCircle, TrendingUp, Info, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BestTime() {
    const { hasChannel } = useContext(AuthContext);
    const [niche, setNiche] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const analyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/best-time', { niche });
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to calculate best time');
        }
        setLoading(false);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To predict the absolute best time to post based on your real audience data, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform active:scale-[0.98]"
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
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To predict the absolute best time to post based on your real audience activity, you must first connect your YouTube handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform active:scale-[0.98]"
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
                <h2 className="text-3xl font-bold mb-2">Best Time to Post</h2>
                <p className="text-gray-400 font-medium">Predict the exact optimal upload window to maximize your initial reach.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="flex flex-col md:flex-row gap-4 max-w-2xl">
                    <input 
                        type="text" placeholder="Channel Topic (e.g. Cooking, Tech, Gaming)"
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={niche} onChange={e => setNiche(e.target.value)} required 
                    />
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Clock size={18} /> {loading ? 'Calculating...' : 'Predict Time'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-blue-500 blur-2xl"></div>
                            <Calendar className="text-blue-500 mx-auto mb-4" size={40} />
                            <h4 className="text-gray-400 font-semibold mb-2 uppercase text-sm tracking-wider">Best Day</h4>
                            <p className="text-3xl font-black text-white">{result.best_day}</p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-cyan-500 blur-2xl"></div>
                            <Clock className="text-cyan-500 mx-auto mb-4" size={40} />
                            <h4 className="text-gray-400 font-semibold mb-2 uppercase text-sm tracking-wider">Optimal Time</h4>
                            <p className="text-3xl font-black text-white">{result.best_time}</p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full bg-green-500 blur-2xl"></div>
                            <CheckCircle className="text-green-500 mx-auto mb-4" size={40} />
                            <h4 className="text-gray-400 font-semibold mb-2 uppercase text-sm tracking-wider">AI Confidence</h4>
                            <p className="text-3xl font-black text-white">{result.confidence}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-500" />
                                    Top 3 Success Windows
                                </h3>
                                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                                    Data-Driven
                                </span>
                            </div>
                            <div className="space-y-4">
                                {result.top_windows?.map((window, i) => (
                                    <div key={i} className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-bold text-blue-500">
                                                #{i+1}
                                            </div>
                                            <span className="font-bold text-gray-200">{window}</span>
                                        </div>
                                        <div className="h-2 w-16 bg-gray-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${100 - i * 20}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Info size={20} className="text-cyan-500" />
                                Strategist's Reasoning
                            </h3>
                            <p className="text-gray-300 leading-relaxed bg-gray-950 p-6 rounded-2xl border border-gray-800 flex-1 italic">
                                "{result.reasoning}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
