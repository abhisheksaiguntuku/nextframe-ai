import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, Wand2, Type, Image as ImageIcon, Zap, FileBarChart, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdvancedStudio() {
    const { hasChannel } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('persona');
    const [inputVal, setInputVal] = useState('');
    const [style, setStyle] = useState('Realistic');
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'persona', name: 'Audience Persona', icon: <Users size={18} />, endpoint: '/ai/persona', key: 'niche', placeholder: 'Enter your category (e.g., Tech Reviews)' },
        { id: 'strategy', name: 'Content Strategy', icon: <FileText size={18} />, endpoint: '/ai/strategy', key: 'topic', placeholder: 'Enter broader channel topic' },
        { id: 'script', name: 'Script Generator', icon: <Wand2 size={18} />, endpoint: '/ai/script', key: 'topic', placeholder: 'Enter video idea' },
        { id: 'title', name: 'Title A/B Ideas', icon: <Type size={18} />, endpoint: '/ai/title-ab', key: 'topic', placeholder: 'Enter core video concept' },
        { id: 'thumbnail', name: 'Thumbnail Ideas', icon: <ImageIcon size={18} />, endpoint: '/ai/thumbnail', key: 'topic', placeholder: 'Enter video title for thumbnail design' },
        { id: 'recs', name: 'Smart Recs', icon: <Zap size={18} />, endpoint: '/ai/recommendations', key: 'topic', placeholder: 'Enter your channel state' },
        { id: 'report', name: 'AI Report', icon: <FileBarChart size={18} />, endpoint: '/ai/report', key: 'topic', placeholder: 'Enter channel category' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    const runAi = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);
        setImagePreview(null);
        try {
            const payload = { style };
            payload[currentTab.key] = inputVal;
            const res = await api.post(currentTab.endpoint, payload);
            setResult(res.data);
            
            // Auto-generate preview if it's the thumbnail tab
            if (activeTab === 'thumbnail' && res.data.image_prompt) {
                generateVisual(inputVal, style);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate AI content. Please try again.');
        }
        setLoading(false);
    };

    const generateVisual = async (topic, styleVal) => {
        setImageLoading(true);
        try {
            const res = await api.post('/ai/generate-image-preview', { topic, style: styleVal });
            setImagePreview(res.data.image_url);
        } catch (e) {
            console.error("Image gen failed");
        }
        setImageLoading(false);
    };

    // Safe renderer for any value - handles strings, arrays, objects without crashing
    const renderValue = (v) => {
        if (v === null || v === undefined) return null;
        if (Array.isArray(v)) {
            return (
                <ul className="list-disc list-inside space-y-2 ml-2 text-white">
                    {v.map((item, i) => (
                        <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
                    ))}
                </ul>
            );
        }
        if (typeof v === 'object') {
            return (
                <div className="space-y-2">
                    {Object.entries(v).map(([subK, subV]) => (
                        <p key={subK} className="text-gray-200 bg-gray-950 p-3 rounded-xl border border-gray-800">
                            <span className="text-purple-300 font-bold">{subK}: </span>
                            {String(subV)}
                        </p>
                    ))}
                </div>
            );
        }
        return (
            <p className="text-gray-200 bg-gray-950 p-4 rounded-xl border border-gray-800 leading-relaxed">
                {String(v)}
            </p>
        );
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Channel Required</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To generate personalized scripts, personas, and strategies, you must first connect your YouTube channel handle.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98]"
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
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI Content Lab</h2>
                <p className="text-gray-400 font-medium">Your all-in-one tools for rapid content ideas and video planning.</p>
            </div>

            <div className="flex overflow-x-auto gap-2 mb-8 bg-gray-900 border border-gray-800 p-2 rounded-2xl">
                {tabs.map(t => (
                    <button 
                        key={t.id}
                        onClick={() => { setActiveTab(t.id); setResult(null); setInputVal(''); setError(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
                    >
                        {t.icon} {t.name}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <form onSubmit={runAi} className="flex flex-col md:flex-row gap-4 relative z-10">
                    <input 
                        type="text" placeholder={currentTab.placeholder}
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        value={inputVal} onChange={e => setInputVal(e.target.value)} required 
                    />
                    
                    {activeTab === 'thumbnail' && (
                        <select 
                            className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                            value={style} onChange={e => setStyle(e.target.value)}
                        >
                            <option>Realistic</option>
                            <option>3D Render</option>
                            <option>Cartoon</option>
                            <option>Cinema</option>
                            <option>Minimalist</option>
                            <option>High Contrast</option>
                        </select>
                    )}

                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Wand2 size={18} /> {loading ? 'Generating...' : `Generate ${currentTab.name}`}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-6 mb-8 text-red-300 font-medium">
                    ⚠️ {error}
                </div>
            )}

            {result && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-purple-400 font-bold text-lg mb-6 flex items-center gap-2">
                        {currentTab.icon} {currentTab.name} Results
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(result).map(([k, v]) => (
                            <div key={k} className="mb-4">
                                <h4 className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-3">
                                    {k.replace(/_/g, ' ')}
                                </h4>
                                {renderValue(v)}
                            </div>
                        ))}

                        {activeTab === 'thumbnail' && (
                            <div className="mt-10 border-t border-gray-800 pt-8">
                                <h4 className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-6">
                                    Visual Preview ({style})
                                </h4>
                                {imageLoading ? (
                                    <div className="aspect-video bg-gray-950 rounded-2xl border border-gray-800 flex items-center justify-center animate-pulse">
                                        <div className="text-gray-500 font-bold">Rendering Visual Concept...</div>
                                    </div>
                                ) : imagePreview ? (
                                    <div className="group relative">
                                        <img 
                                            src={imagePreview} 
                                            alt="Thumbnail Preview" 
                                            className="w-full aspect-video object-cover rounded-2xl border border-gray-800 shadow-2xl transition-transform group-hover:scale-[1.01]" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                            <p className="text-white font-bold bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">AI Generated Concept</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => generateVisual(inputVal, style)}
                                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all text-gray-300 border border-gray-700"
                                    >
                                        Refresh Visual Preview
                                    </button>
                                )}
                                <p className="text-gray-500 text-xs mt-4 italic">
                                    Tip: If you don't like this image, you can copy the "Image Prompt" text above and use it in Midjourney or Canva.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {loading && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 shadow-xl text-center">
                    <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-medium">AI is analyzing your request...</p>
                </div>
            )}
        </Layout>
    );
}
