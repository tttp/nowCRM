"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeFormatToggleProps {
    is24HourFormat: boolean;
    isTimeFormatChanging: boolean;
    toggleTimeFormat: () => void;
}

export const TimeFormatToggle: React.FC<TimeFormatToggleProps> = ({
    is24HourFormat, 
    isTimeFormatChanging,
    toggleTimeFormat
}) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleTimeFormat}
            disabled={isTimeFormatChanging}
            className="flex items-center space-x-1 w-20 justify-center overflow-hidden"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={is24HourFormat ? '24h' : '12h'}  
                    className="flex items-center space-x-1"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium">
                        {is24HourFormat ? '24h' : '12h'} 
                    </span>
                </motion.div>
            </AnimatePresence>
        </Button>
    );
};
