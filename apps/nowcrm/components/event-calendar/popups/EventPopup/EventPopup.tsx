"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { EventCalendarTranslations, CalendarEventType } from "../../types";
import { EventPopupContent } from "./components/PopupContent/PopupContent";
import { EventPopupButton } from "./components/PopupButton";

interface EventPopupProps {
    event?: Partial<CalendarEventType>;
    onAddEvent: (event: Omit<CalendarEventType, 'id'>) => void;
    onUpdateEvent?: (event: CalendarEventType) => void;
    onDeleteEvent?: (eventId: string) => void;
    onClosePopup?: () => void;
    onOpenChange?: (isOpen: boolean) => void;
    dateFromViewClick?: Date;
    children?: React.ReactNode;
    isDisabled?: boolean;
    translations: EventCalendarTranslations;
}

const EventPopup = ({
    event,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onClosePopup,
    onOpenChange,
    dateFromViewClick,
    children,
    isDisabled = false,
    translations,
}: EventPopupProps) => {
    const [open, setOpen] = useState(false);

    const handleDialogChange = (newOpen: boolean) => {
        if (!isDisabled) {
            setOpen(newOpen);
            onOpenChange?.(newOpen);
            if (!newOpen) {
                onClosePopup?.();
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <EventPopupButton
                translations={translations}
                isDisabled={isDisabled}
            >
                {children}
            </EventPopupButton>
            <EventPopupContent
                event={event}
                onAddEvent={onAddEvent}
                onUpdateEvent={onUpdateEvent}
                onDeleteEvent={onDeleteEvent}
                onClosePopup={() => handleDialogChange(false)}
                dateFromViewClick={dateFromViewClick}
                open={open}
                translations={translations}
            />
        </Dialog>
    );
};

export default EventPopup;
