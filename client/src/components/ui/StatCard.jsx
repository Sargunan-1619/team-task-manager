import { motion } from 'framer-motion';

function StatCard({ title, value, icon: Icon, accent, hint }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          {Icon ? <Icon size={18} className="text-white" /> : null}
        </div>
      </div>
      {hint ? <p className="mt-4 text-sm text-slate-500">{hint}</p> : null}
    </motion.div>
  );
}

export default StatCard;
