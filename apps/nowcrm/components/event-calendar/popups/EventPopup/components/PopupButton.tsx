"use client";

import { EventCalendarTranslations } from "@/components/event-calendar/types"; import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface EventPopupButtonProps {
    translations: EventCalendarTranslations;
    children?: React.ReactNode;
    isDisabled?: boolean;
}

export const EventPopupButton = ({
    translations,
    children,
    isDisabled = false,
}: EventPopupButtonProps) => {
    if (children) {
        return <DialogTrigger asChild disabled={isDisabled}>{children}</DialogTrigger>;
    }

    return (
        <DialogTrigger asChild>
            <Button
                variant="default"
                size="sm"
                className="w-full gap-0 sm:w-auto text-xs sm:text-sm"
                disabled={isDisabled}
            >
                <CalendarPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {translations.addEvent}
            </Button>
        </DialogTrigger>
    );
};
