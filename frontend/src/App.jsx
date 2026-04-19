import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, Component } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SeoStudio from './pages/SeoStudio';
import Predictor from './pages/Predictor';
import SentimentAnalysis from './pages/SentimentAnalysis';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import TrendingIdeas from './pages/TrendingIdeas';
import BestTime from './pages/BestTime';
import AdvancedStudio from './pages/AdvancedStudio';

// Global Error Boundary — catches any render crash and shows a fallback
// instead of a blank black screen
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('NextFrame Error Boundary caught:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-8">
                    <div className="text-6xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
                    <p className="text-gray-400 text-center max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred. Please refresh the page.'}
                    </p>
                    <button
                        onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-gray-950 text-white">Loading system...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                  <ErrorBoundary><Dashboard /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/seo-studio" element={
              <ProtectedRoute>
                  <ErrorBoundary><SeoStudio /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/predict" element={
              <ProtectedRoute>
                  <ErrorBoundary><Predictor /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/sentiment" element={
              <ProtectedRoute>
                  <ErrorBoundary><SentimentAnalysis /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/competitor" element={
              <ProtectedRoute>
                  <ErrorBoundary><CompetitorAnalysis /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/trends" element={
              <ProtectedRoute>
                  <ErrorBoundary><TrendingIdeas /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/best-time" element={
              <ProtectedRoute>
                  <ErrorBoundary><BestTime /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="/advanced-studio" element={
              <ProtectedRoute>
                  <ErrorBoundary><AdvancedStudio /></ErrorBoundary>
              </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
