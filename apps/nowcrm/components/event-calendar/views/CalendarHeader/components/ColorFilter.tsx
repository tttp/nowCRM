"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EventCalendarConfigType } from "@/components/event-calendar/types";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT_COLOR_OPTIONS } from "../../../constants/eventColors";


interface ColorFilterProps {
    isFilterOpen: boolean;
    setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedColors: string[];
    toggleColorSelection: (color: string) => void;
    currentConfig: EventCalendarConfigType;
}

export const ColorFilter: React.FC<ColorFilterProps> = ({
    isFilterOpen,
    setIsFilterOpen,
    selectedColors,
    toggleColorSelection,
    currentConfig
}) => {
    return (
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-20 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isFilterOpen ? 'open' : 'closed'}
                            className="flex items-center space-x-1"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Filter className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs font-medium">
                                {isFilterOpen ? currentConfig.localization!.filtering : currentConfig.localization!.filter}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{currentConfig.localization!.filterByColor}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {EVENT_COLOR_OPTIONS.map((color) => (
                    <DropdownMenuCheckboxItem
                        key={color.value}
                        checked={selectedColors.includes(color.value)}
                        onCheckedChange={() => toggleColorSelection(color.value)}
                        onSelect={(event) => {
                            event.preventDefault();
                        }}
                    >
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`} />
                            {color.label}
                        </div>
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full justify-center h-8 text-sm"
                >
                    {currentConfig.localization!.close}
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
