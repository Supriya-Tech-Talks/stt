import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Card = forwardRef(({ children, className = '', hover = true, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-300 ${
        hover ? 'hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-500/50' : ''
      } ${className}`}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
