import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  glass = true,
  onClick,
  ...props 
}) => {
  const baseStyles = "rounded-xl overflow-hidden p-6";
  const glassStyles = glass ? "glass" : "bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700";
  const hoverStyles = hoverable ? "hover-card cursor-pointer" : "";
  
  return (
    <motion.div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...(hoverable ? { whileHover: { y: -5 } } : {})}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
