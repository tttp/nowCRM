"use client";

import React, { useState } from 'react';
import { format} from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CalendarEventType, EventCalendarTranslations } from '../types';
import EventPopup from './EventPopup/EventPopup';

interface EventListPopupProps {
    events: CalendarEventType[];
    date: Date;
    addEvent: (event: Omit<CalendarEventType, 'id'>) => void;
    updateEvent: (event: CalendarEventType) => void;
    getEventColor: (color: string) => string;
    onDelete?: (eventId: string) => void;
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    preSelectedColor?: string;
    is24HourFormat: boolean | undefined;
    translations: EventCalendarTranslations;
}

const EventListPopup: React.FC<EventListPopupProps> = ({
    events,
    date,
    addEvent,
    updateEvent,
    getEventColor,
    onDelete,
    children,
    onOpenChange,
    preSelectedColor,
    is24HourFormat,
    translations,
}) => {
    const [editingEvent, setEditingEvent] = useState<CalendarEventType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEditClick = (event: CalendarEventType) => {
        setEditingEvent(event);
        setIsDialogOpen(true);
    };

    const handleUpdateEvent = (updatedEvent: Omit<CalendarEventType, 'id'>) => {
        if (editingEvent) {
            updateEvent(updatedEvent);
            setEditingEvent(null);
        }
    };

    const handleCloseDialog = () => {
        setEditingEvent(null);
        setIsDialogOpen(false);
    };

    const getEventStyle = (event: CalendarEventType) => {
        return cn(
            getEventColor(event.color),
            "p-2 rounded cursor-pointer hover:opacity-80 transition-opacity w-full text-left",
            "transition-colors duration-200",
            "hover:bg-opacity-40",
            "dark:hover:bg-opacity-40"
        );
    };

    const getEventTimeDisplay = (event: CalendarEventType) => {
        if (event.publish_date) {
            return `Published on ${format(new Date(event.publish_date), 'MMMM d, yyyy')}`;
        }
        return 'No date';
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{format(date, 'MMMM d, yyyy')}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] mt-4">
                    <div className="space-y-2 pr-4 flex flex-col items-center pl-6">
                        {events.sort((a, b) =>
                            new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()
                            )
                        .map((event) => (
                            <EventPopup
                                key={event.id}
                                event={event}
                                onAddEvent={addEvent}
                                onUpdateEvent={handleUpdateEvent}
                                onDeleteEvent={onDelete}
                                onOpenChange={onOpenChange}
                                dateFromViewClick={date}
                                translations={translations}
                            >
                                <div
                                    className={getEventStyle(event)}
                                    onClick={() => handleEditClick(event)}
                                >
                                    {event.name && <div className="font-semibold truncate">{event.name}</div>}
                                    <div className="text-xs">
                                        {getEventTimeDisplay(event)}
                                    </div>
                                    {event.description && (<div className="text-xs truncate mt-0.5">{event.description}</div>)}
                                </div>
                            </EventPopup>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-4 flex justify-between items-center">
                    <EventPopup
                        translations={translations}
                        event={{ publish_date: date, color: preSelectedColor }}
                        onAddEvent={addEvent}
                        dateFromViewClick={date}
                    >
                        <Button variant="outline" className="flex-grow mr-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {translations.addEvent}
                        </Button>
                    </EventPopup>
                    <Button variant="outline" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EventListPopup;
