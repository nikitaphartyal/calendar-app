"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface MagicButtonProps {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  variant = "primary",
  className,
}: MagicButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600",
    secondary: "bg-gradient-to-r from-gray-900 to-gray-800",
    outline: "bg-transparent border-2 border-blue-500/50"
  };

  const buttonClass = variants[variant];

  return (
    <motion.button
      className={`group relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border gradient */}
      <motion.span 
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)]"
        animate={{
          opacity: isHovered ? [0.7, 1, 0.7] : 0.5,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Button content container */}
      <motion.span
        className={`relative inline-flex h-full w-full items-center justify-center rounded-full px-8 py-2 
                   text-base font-medium transition-all duration-200 ease-out
                   ${buttonClass} ${variant === 'outline' ? 'text-blue-500 dark:text-blue-500 hover:text-white dark:hover:text-white' : 'text-white dark:text-white'}
                   backdrop-blur-3xl hover:backdrop-blur-2xl dark:backdrop-blur-3xl dark:hover:backdrop-blur-2xl`}
      >
        {/* Left icon */}
        {position === "left" && (
          <motion.span
            className="mr-2"
            animate={isHovered ? { x: [-2, 2, -2] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {icon}
          </motion.span>
        )}

        {/* Button text with floating particles */}
        <span className="relative">
          {title}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                className="absolute top-0 left-0 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute inline-flex h-1 w-1 rounded-full bg-white/50 dark:bg-white/50"
                    initial={{ 
                      y: 0,
                      x: Math.random() * 20 - 10,
                      opacity: 1 
                    }}
                    animate={{ 
                      y: -20,
                      opacity: 0
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Right icon with rocket animation */}
        {position === "right" && (
          <motion.span
            className="ml-2"
            animate={isHovered ? {
              x: [0, 4, 0],
              y: [0, -2, 0],
              rotate: [0, 10, 0]
            } : {}}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.span>
        )}

        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isHovered 
              ? `0 0 20px ${variant === 'primary' ? '#3B82F6' : variant === 'secondary' ? '#10B981' : '#60A5FA'}` 
              : "none"
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.span>
    </motion.button>
  );
};

export default MagicButton;
