import { motion } from 'framer-motion';

function Surface({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-[28px] border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Surface;
