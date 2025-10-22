import React, { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface YearSwitcherProps extends PopoverTriggerProps {
    currentYear: number;
    onYearChange: (year: number) => void;
    onDateChange?: (date: Date) => void;
    currentDate: Date;
    isAnimating: boolean;
    direction: 'up' | 'down';
}

export default function YearSwitcher({ 
    className, 
    currentYear, 
    onYearChange, 
    onDateChange,
    currentDate,
    isAnimating, 
    direction 
}: YearSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(currentYear);
    const [inputYear, setInputYear] = useState(currentYear.toString());

    useEffect(() => {
        setYear(currentYear);
        setInputYear(currentYear.toString());
    }, [currentYear]);

    const handleYearUpdate = (newYear: number) => {
        if (newYear >= 1900 && newYear <= 3100) {
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            
            const newDate = new Date(newYear, currentMonth, currentDay);
            
            if (newDate.getMonth() !== currentMonth) {
                newDate.setDate(0);
            }

            setYear(newYear);
            setInputYear(newYear.toString());
            onYearChange(newYear);
            
            if (onDateChange) {
                onDateChange(newDate);
            }
        }
    };

    const handleYearChange = (increment: number) => {
        const newYear = year + increment;
        handleYearUpdate(newYear);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputYear(newValue);

        const parsedYear = parseInt(newValue, 10);
        if (!isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100) {
            handleYearUpdate(parsedYear);
        }
    };

    const handleInputBlur = () => {
        if (inputYear !== year.toString()) {
            setInputYear(year.toString());
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a year"
                    className={cn(
                        "w-[70px] sm:w-[71px] justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm p-2 sm:p-2",
                        className
                    )}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={year}
                            className="text-xs sm:text-sm"
                            initial={isAnimating ? { y: direction === 'down' ? 10 : -10, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: direction === 'down' ? -10 : 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {year}
                        </motion.p>
                    </AnimatePresence>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90px] sm:w-[130px] p-2">
                <div className="flex flex-col items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8"
                        onClick={() => handleYearChange(1)}
                    >
                        <ChevronUpIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                    </Button>
                    <Input
                        type="text"
                        value={inputYear}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="w-full text-center text-xs sm:text-sm h-8"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8"
                        onClick={() => handleYearChange(-1)}
                    >
                        <ChevronDownIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
