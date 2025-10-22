"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TodayButtonProps {
    handleTodayClick: () => void;
    isTodayDisabled: boolean;
    getTodayButtonText: () => string;
}

export const TodayButton: React.FC<TodayButtonProps> = ({
    handleTodayClick,
    isTodayDisabled,
    getTodayButtonText,
}) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
            disabled={isTodayDisabled}
            className="flex items-center space-x-1 w-28 h-10 justify-center overflow-hidden"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={getTodayButtonText()}
                    className="flex items-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1.05, 1] }}
                    transition={{
                        duration: 0.2,
                        times: [0, 0.8, 1]
                    }}
                >
                    <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                    <span>{getTodayButtonText()}</span>
                </motion.div>
            </AnimatePresence>
        </Button>
    );
};
