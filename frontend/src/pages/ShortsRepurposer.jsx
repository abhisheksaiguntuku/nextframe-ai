import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Scissors, Youtube, Wand2, Copy, Check, ExternalLink, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShortsRepurposer() {
    const { hasChannel } = useContext(AuthContext);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleRepurpose = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/ai/repurpose', { video_url: videoUrl });
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to repurpose video');
        }
        setLoading(false);
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Connect Your Channel First</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">The Shorts Repurposer needs your channel brand context to create viral clips that match your voice.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98]"
                    >
                        Go to Dashboard
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
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                            <Scissors size={28} />
                        </div>
                        Shorts Repurposer
                    </h2>
                    <p className="text-gray-400 font-medium">Extract high-impact, viral Short-form ideas from any long YouTube video.</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Youtube className="text-red-500" /> Analyze Long-Form Video
                    </h3>
                    <form onSubmit={handleRepurpose} className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                            placeholder="Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=...)"
                            value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required 
                        />
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-10 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Wand2 size={20} />
                            {loading ? 'Finding Viral Moments...' : 'Scan for Shorts'}
                        </button>
                    </form>
                </div>

                {loading && (
                    <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-3xl animate-pulse">
                        <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold text-lg">Our AI is watching your video to find the best clips...</p>
                    </div>
                )}

                {result && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {result.viral_packs.map((pack, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-600 transition-all shadow-xl group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">
                                        Viral Clip #{idx + 1}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(pack.script_body, idx)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                        title="Copy Script"
                                    >
                                        {copiedIdx === idx ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                                
                                <h4 className="text-2xl font-black text-white mb-4 line-clamp-2">{pack.short_title}</h4>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                                        <p className="text-red-400 text-xs font-black uppercase mb-1">Impact Hook</p>
                                        <p className="text-white font-bold italic">"{pack.hook}"</p>
                                    </div>
                                    <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 flex-1">
                                        <p className="text-gray-500 text-xs font-black uppercase mb-2 tracking-widest">Viral Script</p>
                                        <p className="text-gray-300 leading-relaxed font-medium">{pack.script_body}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                                        <ExternalLink size={14} /> CTA: <span className="text-gray-300">{pack.cta}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-bold uppercase">{pack.visual_cue}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
