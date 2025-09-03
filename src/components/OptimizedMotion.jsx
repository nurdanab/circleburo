// src/components/OptimizedMotion.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Optimized motion components with reduced motion support
const OptimizedMotion = {
  // Container with optimized animations
  Container: ({ children, className = "", ...props }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  ),

  // Header animation
  Header: ({ children, className = "", ...props }) => (
    <motion.header
      className={className}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
      {...props}
    >
      {children}
    </motion.header>
  ),

  // Fade in animation
  FadeIn: ({ children, className = "", delay = 0, ...props }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  ),

  // Scale animation
  ScaleIn: ({ children, className = "", delay = 0, ...props }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  ),

  // Stagger children animation
  StaggerContainer: ({ children, className = "", staggerDelay = 0.1, ...props }) => (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  ),

  // Stagger child item
  StaggerItem: ({ children, className = "", ...props }) => (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
};

export default OptimizedMotion;
