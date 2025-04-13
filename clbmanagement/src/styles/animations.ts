import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
};

export const staggerContainer: Variants = {
    animate: {
        transition: { staggerChildren: 0.1 }
    }
};

export const scaleIn: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
};

export const pageTransition: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
};
