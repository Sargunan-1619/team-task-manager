import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await login(values);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_28%),linear-gradient(135deg,_#07111d_0%,_#111a2d_50%,_#1f3253_100%)] px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_28%),linear-gradient(135deg,_rgba(14,116,144,0.28),_rgba(37,99,235,0.1))] p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
              <Sparkles size={16} />
              Secure collaborative planning
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-200">Welcome back</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Bring clarity to your daily work.</h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">A polished workspace that helps teams plan, ship, and stay aligned without friction.</p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-slate-950/35 p-5 shadow-inner">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck size={18} className="text-emerald-300" />
                JWT-authenticated, production-ready, and beautifully simple.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/70 p-8 sm:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Sign in</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Access your workspace</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15"
                  placeholder="you@company.com"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="mt-1 text-sm text-rose-300">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15"
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-rose-300">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              New here?{' '}
              <Link className="font-semibold text-sky-300" to="/register">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;
