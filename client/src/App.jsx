import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ className: 'rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-xl backdrop-blur-xl', duration: 3000 }} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;