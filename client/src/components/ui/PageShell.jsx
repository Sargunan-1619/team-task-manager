import { motion } from 'framer-motion';

function PageShell({ title, eyebrow, description, children, actions }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </motion.div>
  );
}

export default PageShell;
