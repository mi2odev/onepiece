import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

type Variant = 'glass' | 'ghost' | 'gold';

// Drop the handful of DOM handlers whose types clash with Framer Motion.
type NativeButton = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
>;

interface ButtonProps extends NativeButton {
  children: ReactNode;
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  glass: 'glass text-cloud hover:bg-white/15',
  ghost: 'border border-white/20 text-cloud/90 hover:bg-white/10',
  gold: 'bg-gold text-ocean-deep font-semibold shadow-gold-ring hover:brightness-105',
};

export function Button({ children, variant = 'glass', className = '', ...rest }: ButtonProps) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.button
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
