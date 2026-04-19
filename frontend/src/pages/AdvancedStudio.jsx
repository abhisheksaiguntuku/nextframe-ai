import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Users, FileText, Wand2, Type, Image as ImageIcon, Zap, FileBarChart } from 'lucide-react';

export default function AdvancedStudio() {
    const [activeTab, setActiveTab] = useState('persona');
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'persona', name: 'Audience Persona', icon: <Users size={18} />, endpoint: '/ai/persona', key: 'niche', placeholder: 'Enter your niche (e.g., Tech Reviews)' },
        { id: 'strategy', name: 'Content Strategy', icon: <FileText size={18} />, endpoint: '/ai/strategy', key: 'topic', placeholder: 'Enter broader channel topic' },
        { id: 'script', name: 'Script Generator', icon: <Wand2 size={18} />, endpoint: '/ai/script', key: 'topic', placeholder: 'Enter video idea' },
        { id: 'title', name: 'Title A/B Ideas', icon: <Type size={18} />, endpoint: '/ai/title-ab', key: 'topic', placeholder: 'Enter core video concept' },
        { id: 'thumbnail', name: 'Thumbnail Ideas', icon: <ImageIcon size={18} />, endpoint: '/ai/thumbnail', key: 'topic', placeholder: 'Enter video title for thumbnail design' },
        { id: 'recs', name: 'Smart Recs', icon: <Zap size={18} />, endpoint: '/ai/recommendations', key: 'topic', placeholder: 'Enter your channel state' },
        { id: 'report', name: 'AI Report', icon: <FileBarChart size={18} />, endpoint: '/ai/report', key: 'topic', placeholder: 'Enter channel niche' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    const runAi = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const payload = {};
            payload[currentTab.key] = inputVal;
            const res = await api.post(currentTab.endpoint, payload);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate AI content. Please try again.');
        }
        setLoading(false);
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

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Advanced AI Lab</h2>
                <p className="text-gray-400 font-medium">Your all-in-one suite for rapid content ideation and production.</p>
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

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={runAi} className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" placeholder={currentTab.placeholder}
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        value={inputVal} onChange={e => setInputVal(e.target.value)} required 
                    />
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
