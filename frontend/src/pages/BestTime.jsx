import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Clock, Calendar, CheckCircle } from 'lucide-react';

export default function BestTime() {
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

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">Best Time to Post</h2>
                <p className="text-gray-400 font-medium">Predict the exact optimal upload window to maximize your initial reach.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl mb-8">
                <form onSubmit={analyze} className="flex flex-col md:flex-row gap-4 max-w-2xl">
                    <input 
                        type="text" placeholder="Your Niche or Audience Region"
                        className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={niche} onChange={e => setNiche(e.target.value)} required 
                    />
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Clock size={18} /> {loading ? 'Calculating...' : 'Predict Time'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
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
            )}
        </Layout>
    );
}
