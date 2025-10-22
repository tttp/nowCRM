"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EventSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const EventSkeleton: React.FC<EventSkeletonProps> = ({ className, style }) => {
    return (
      <motion.div
        className={cn(
          "bg-gray-50 dark:bg-transparent rounded-md overflow-hidden relative",
          className
        )}
        style={style}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.5, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-muted-foreground to-transparent skeleton-shimmer" />
      </motion.div>
    );
  };

export default EventSkeleton;
