import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password') || '';
  const passwordStrength = useMemo(() => {
    if (password.length >= 12) return { label: 'Strong', color: 'text-emerald-300' };
    if (password.length >= 8) return { label: 'Good', color: 'text-sky-300' };
    if (password.length >= 6) return { label: 'Fair', color: 'text-amber-300' };
    return { label: 'Weak', color: 'text-rose-300' };
  }, [password]);

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const data = await registerUser(values);

      if (data?.success) {
        toast.success('Account created. Welcome!');
        navigate('/dashboard');
        return;
      }

      throw new Error(data?.message || 'Registration failed');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_28%),linear-gradient(135deg,_#07111d_0%,_#111a2d_50%,_#1f3253_100%)] px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950/70 p-8 sm:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
              <Sparkles size={16} />
              Create your command center
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Register</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start building momentum with your team.</h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-400">Craft beautiful plans, track work effortlessly, and move from idea to execution in one calm workspace.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 shadow-inner">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck size={18} className="text-emerald-300" />
                Secure sign-up with instant access to your dashboard.
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-slate-950/80 p-8 sm:p-10 lg:p-12">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="name">Full name</label>
              <input id="name" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="mt-1 text-sm text-rose-300">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
              <input id="email" type="email" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="mt-1 text-sm text-rose-300">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password ? <p className={`mt-2 text-sm ${passwordStrength.color}`}>Strength: {passwordStrength.label}</p> : null}
              {errors.password && <p className="mt-1 text-sm text-rose-300">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="role">Role</label>
              <select id="role" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:bg-white/15" {...register('role')}>
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link className="font-semibold text-sky-300" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
