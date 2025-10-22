"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EventCalendarConfigType } from "@/components/event-calendar/types";
import { CalendarIcon, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ListViewToggleProps {
    isListView: boolean;
    setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
    currentConfig: EventCalendarConfigType;
}

export const ListViewToggle: React.FC<ListViewToggleProps> = ({
    isListView,
    setIsListView,
    currentConfig
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsListView(!isListView)}
                        className="flex items-center space-x-1 w-10 h-10 justify-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isListView ? 'list' : 'calendar'}
                                className="flex items-center space-x-1"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isListView ? 
                                    <CalendarIcon className="h-4 w-4" /> : 
                                    <ListChecks className="h-4 w-4" />
                                }
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {isListView ? 
                            currentConfig.localization!.displayCalendar : 
                            currentConfig.localization!.displayList
                        }
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
