import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Wand2, RefreshCw, Layers, Video, PlayCircle, Star, MonitorPlay, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContentCalendar() {
    const { hasChannel, channelData } = useContext(AuthContext);
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [calendar, setCalendar] = useState(null);
    const [monthlyAngle, setMonthlyAngle] = useState('');
    const [rerollingIndex, setRerollingIndex] = useState(null);

    const generateCalendar = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setCalendar(null);
        try {
            const res = await api.post('/ai/calendar', { niche: topic });
            setCalendar(res.data.calendar);
            setMonthlyAngle(res.data.monthly_angle);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to generate calendar');
        }
        setLoading(false);
    };

    const reRollDay = async (idx) => {
        setRerollingIndex(idx);
        try {
            // We use a specialized "re-roll" prompt logic by calling a similar endpoint
            // or just re-generating a single day via the strategy endpoint
            const res = await api.post('/ai/strategy', { topic: `${topic} day ${idx + 1}` });
            const newDay = {
                day: idx + 1,
                title: res.data.pillar_videos[0] || 'Viral Concept Update',
                format: Math.random() > 0.5 ? 'Short' : 'Long',
                strategy: 'Re-rolled Strategy',
                brief: 'Fresh idea generated just for you.'
            };
            const updated = [...calendar];
            updated[idx] = newDay;
            setCalendar(updated);
        } catch (err) {
            console.error("Re-roll failed");
        }
        setRerollingIndex(null);
    };

    if (!hasChannel) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto mt-20 text-center border border-gray-800 bg-gray-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-xl">
                        <MonitorPlay size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Channel Category Required</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">To generate a 30-day strategy that doesn't repeat your past videos, we need to know your channel category first.</p>
                    <Link 
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 px-12 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all transform active:scale-[0.98]"
                    >
                        Connect Channel
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <Calendar size={32} />
                            </div>
                            30-Day Auto-Pilot
                        </h2>
                        <p className="text-gray-400 font-medium flex items-center gap-2">
                            <Star size={16} className="text-amber-500 fill-amber-500" /> 
                            Hyper-personalized content roadmap for <span className="text-white font-bold">{channelData?.handle}</span>
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-2xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">History Lock Active</span>
                    </div>
                </div>

                {!calendar && !loading && (
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="max-w-md mx-auto">
                            <h3 className="text-2xl font-bold mb-4">Set Your Monthly Focus</h3>
                            <p className="text-gray-400 mb-8">What is the core topic for your next 30 days of content?</p>
                            <form onSubmit={generateCalendar} className="space-y-4">
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-950 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center font-bold text-lg"
                                    placeholder="e.g. AI Coding, Travel Vlogs, Fitness"
                                    value={topic} onChange={e => setTopic(e.target.value)} required 
                                />
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black py-4 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <Wand2 size={24} /> Generate 30-Day Strategy
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-32 bg-gray-900/50 border border-gray-800 rounded-3xl backdrop-blur-xl">
                        <div className="relative inline-block w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-2xl font-black mb-2">Analyzing Brand DNA...</h3>
                        <p className="text-gray-400">Locking history and calculating growth trajectory.</p>
                    </div>
                )}

                {calendar && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Layers className="text-emerald-500" />
                                <div>
                                    <p className="text-xs font-black uppercase text-emerald-500/80">Monthly Strategy Persona</p>
                                    <h4 className="text-xl font-bold text-white">{monthlyAngle}</h4>
                                </div>
                            </div>
                            <button onClick={() => generateCalendar()} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-all">
                                <RefreshCw size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {calendar.map((item, idx) => (
                                <div key={idx} className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/50 transition-all flex flex-col relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center font-black text-emerald-500 border border-emerald-500/20">
                                            {item.day}
                                        </div>
                                        <button 
                                            onClick={() => reRollDay(idx)}
                                            className="text-gray-600 hover:text-emerald-500 transition-colors"
                                            disabled={rerollingIndex === idx}
                                        >
                                            <RefreshCw size={16} className={rerollingIndex === idx ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {item.format === 'Short' ? 
                                                <PlayCircle size={14} className="text-red-500" /> : 
                                                <Video size={14} className="text-emerald-500" />
                                            }
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.format === 'Short' ? 'text-red-500/80' : 'text-emerald-500/80'}`}>
                                                {item.format}
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors line-clamp-2 min-h-[40px]">
                                            {item.title}
                                        </h5>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                                        <div className="bg-gray-950 px-2 py-1 rounded text-[10px] font-bold text-gray-500 uppercase inline-block">
                                            {item.strategy}
                                        </div>
                                    </div>
                                    
                                    {/* Hover info tooltip simulation */}
                                    <div className="absolute inset-0 bg-gray-900/95 p-6 translate-y-full group-hover:translate-y-0 transition-transform flex flex-col justify-center">
                                        <p className="text-emerald-500 text-[10px] font-black uppercase mb-2">The Brief</p>
                                        <p className="text-xs text-gray-300 font-medium leading-relaxed italic line-clamp-4">
                                            "{item.brief}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
