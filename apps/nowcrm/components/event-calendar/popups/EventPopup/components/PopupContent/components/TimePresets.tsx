"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CalendarEventType, EventCalendarTranslations } from "@/components/event-calendar/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TimePresetsProps {
    form: UseFormReturn<CalendarEventType>;
    translations: EventCalendarTranslations;
}

const TimePresets: React.FC<TimePresetsProps> = ({
    form,
    translations
}) => {
    const timePresets = [
        { label: translations.timePresetAllDay, publish_date: '00:00' },
        { label: translations.timePresetEarlyMorning, publish_date: '06:00' },
        { label: translations.timePresetMorning, publish_date: '09:00' },
        { label: translations.timePresetLunch, publish_date: '12:00' },
        { label: translations.timePresetEarlyAfternoon, publish_date: '13:00' },
        { label: translations.timePresetLateAfternoon, publish_date: '15:00' },
        { label: translations.timePresetEvening, publish_date: '17:00' },
        { label: translations.timePresetNight, publish_date: '20:00' },
    ] as const;

    const handleTimePresetClick = (preset: typeof timePresets[number]) => {
        const [hours, minutes] = preset.publish_date.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        form.setValue('publish_date', now);
    };

    return (
        <div className="pt-2 pb-1">
            <Carousel className="w-full max-w-xs mx-auto sm:px-0">
                <CarouselContent className="">
                    {timePresets.map((preset) => (
                        <CarouselItem key={preset.label} className="basis-1/3">
                            <motion.div
                                whileHover={{ scale: 1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTimePresetClick(preset)}
                                    className={cn(
                                        "w-full text-xs h-5 mx-auto flex",
                                        form.watch('publish_date') &&
                                        form.watch('publish_date') instanceof Date &&
                                        form.watch('publish_date').getHours() === Number(preset.publish_date.split(':')[0])
                                            ? "bg-primary text-primary-foreground"
                                            : ""
                                    )}
                                >
                                    <span className="text-[10px] sm:text-xs">{preset.label}</span>
                                </Button>
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="flex"
                    type="button"
                />
                <CarouselNext
                    className="flex"
                    type="button"
                />
            </Carousel>
        </div>
    );
};

export default TimePresets;
