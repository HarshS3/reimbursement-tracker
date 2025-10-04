import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Scroll-triggered animation hook
export const useScrollAnimation = (offset = 100) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, offset], [0, 1]);
  const y = useTransform(scrollY, [0, offset], [50, 0]);
  
  return { opacity, y };
};

// Scroll reveal component
export const ScrollReveal = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  threshold = 0.1,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      viewport={{ once: true, amount: threshold }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  ...props 
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, ...props }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingElement = ({ 
  children, 
  duration = 3,
  amplitude = 10,
  ...props 
}) => {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale on hover component
export const ScaleOnHover = ({ 
  children, 
  scale = 1.05,
  duration = 0.2,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Fade in up animation
export const FadeInUp = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  distance = 30,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide in from left
export const SlideInLeft = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  distance = -100,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide in from right
export const SlideInRight = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  distance = 100,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Parallax scrolling component
export const ParallaxScroll = ({ 
  children, 
  speed = 0.5,
  ...props 
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);
  
  return (
    <motion.div
      style={{ y }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Rotation animation
export const RotateOnHover = ({ 
  children, 
  rotation = 360,
  duration = 0.5,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ rotate: rotation }}
      transition={{ duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation
export const PulseAnimation = ({ 
  children, 
  scale = [1, 1.05, 1],
  duration = 2,
  ...props 
}) => {
  return (
    <motion.div
      animate={{ scale }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};