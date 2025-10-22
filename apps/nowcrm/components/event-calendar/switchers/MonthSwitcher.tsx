import * as React from "react"
import {
    CaretSortIcon,
    CheckIcon,
    CalendarIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AnimatePresence, motion } from "framer-motion"
import { EventCalendarTranslations } from "../types/EventCalendarTranslations"

export type Month = {
    label: string;
    value: string;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface MonthSwitcherProps extends PopoverTriggerProps {
    selectedMonth: Month;
    onMonthChange: (month: Month) => void;
    onDateChange?: (date: Date) => void;
    isAnimating: boolean;
    direction: 'up' | 'down';
    translations: EventCalendarTranslations;
    currentDate: Date;
}

export default function MonthSwitcher({
    className,
    selectedMonth,
    onMonthChange,
    onDateChange,
    isAnimating,
    direction,
    translations,
    currentDate
}: MonthSwitcherProps) {
    const [open, setOpen] = React.useState(false);

    // Create months array from translations
    const months: Month[] = translations.monthNames.map((monthName) => ({
        label: monthName,
        value: monthName.toLowerCase().slice(0, 3)
    }));

    const handleMonthSelection = (month: Month) => {
        const currentDay = currentDate.getDate();
        const currentYear = currentDate.getFullYear();
        
        const monthIndex = months.findIndex(m => m.value === month.value);
        
        const newDate = new Date(currentYear, monthIndex, currentDay);
        
        if (newDate.getDate() !== currentDay) {
            newDate.setMonth(monthIndex + 1, 0);
        }
        
        onMonthChange(month);
        
        if (onDateChange) {
            onDateChange(newDate);
        }
        
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={translations.selectDate}
                    className={cn(
                        "w-[110px] sm:w-[151px] justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm p-2 sm:p-2",
                        className
                    )}
                >
                    <CalendarIcon className="hidden sm:inline-block mr-2 h-4 w-4" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={selectedMonth.value}
                            className="text-xs sm:text-sm flex-grow text-center"
                            initial={isAnimating ? { y: direction === 'down' ? 10 : -10, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: direction === 'down' ? -10 : 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {selectedMonth.label}
                        </motion.p>
                    </AnimatePresence>
                    <CaretSortIcon className="hidden sm:inline-block ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[110px] sm:w-[151px] p-0">
                <Command>
                    <CommandInput
                        placeholder={translations.search}
                        className="text-xs sm:text-sm"
                    />
                    <CommandList>
                        <CommandEmpty className="text-xs sm:text-sm">
                            {translations.noEvents}
                        </CommandEmpty>
                        <CommandGroup>
                            {months.map((month) => (
                                <CommandItem
                                    key={month.value}
                                    onSelect={() => handleMonthSelection(month)}
                                    className="text-xs sm:text-sm"
                                >
                                    {month.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4 sm:h-4 sm:w-4",
                                            selectedMonth.value === month.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
