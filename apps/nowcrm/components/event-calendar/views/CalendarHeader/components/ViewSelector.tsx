"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { EventCalendarConfigType } from "@/components/event-calendar/types";
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarViewType } from "../../../types/CalendarViewType";

interface ViewOption {
    value: CalendarViewType;
    label: string;
    icon: LucideIcon;
}

interface ViewSelectorProps {
    currentView: CalendarViewType;
    setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
    viewOptions: ViewOption[];
    currentConfig: EventCalendarConfigType;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
    currentView,
    setCurrentView,
    viewOptions,
    currentConfig
}) => {
    return (
        <div className="inline-flex items-center rounded-md border border-input bg-transparent p-1 w-full sm:w-[240px]">
            <TooltipProvider>
                {viewOptions.map((view) => {
                    const IconComponent = view.icon;
                    const isSelected = currentView === view.value;
                    return (
                        <Tooltip key={view.value}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    className="relative flex-grow"
                                    initial={false}
                                    animate={{ flex: isSelected ? 2 : 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Button
                                        variant={isSelected ? "secondary" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "relative h-8 w-full overflow-hidden transition-colors",
                                            isSelected
                                                ? "bg-secondary text-secondary-foreground"
                                                : "hover:bg-secondary/50 hover:text-secondary-foreground",
                                            !isSelected && "cursor-pointer"
                                        )}
                                        onClick={() => setCurrentView(view.value)}
                                    >
                                        <div className="flex items-center justify-center space-x-1 w-full">
                                            <IconComponent className={cn(
                                                "h-4 w-4 flex-shrink-0",
                                                isSelected ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.span
                                                        className="text-xs font-medium whitespace-nowrap overflow-hidden"
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: 'auto' }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {view.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </Button>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{`${currentConfig.localization!.viewBy} ${view.label}`}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
};
