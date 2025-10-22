"use client";

import { CalendarEventType, CalendarViewType, EventCalendarConfigType } from "../../types";
import MonthBasicView from "./MonthBasicView";
import MonthDetailedView from "./MonthDetailedView";

interface MonthViewProps {
    filteredEvents: CalendarEventType[];
    onEventUpdate: (event: CalendarEventType) => Promise<void>;
    onEventDelete: (eventId: string) => Promise<void>;
    onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
    isLoading: boolean;
    currentDate: Date;
    currentConfig: EventCalendarConfigType;
    is24HourFormat: boolean | undefined;
    isAddEventPopupOpen: boolean;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
    setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;
}

const MonthView: React.FC<MonthViewProps> = ({
    filteredEvents,
    currentDate,
    currentConfig,
    is24HourFormat,
    setIsAddEventPopupOpen,
    isAddEventPopupOpen,
    setCurrentDate,
    setCurrentView,
    onEventUpdate,
    onEventDelete,
    onEventAdd,
    isLoading,
    onDateRangeChange
}) => {
    return (
        <>
            {currentConfig.monthView?.viewType === 'detailed'
                ? <MonthDetailedView
                    filteredEvents={filteredEvents}
                    currentDate={currentDate}
                    is24HourFormat={is24HourFormat}
                    isAddEventPopupOpen={isAddEventPopupOpen}
                    currentConfig={currentConfig}
                    setCurrentDate={setCurrentDate}
                    setCurrentView={setCurrentView}
                    onEventAdd={onEventAdd}
                    onEventUpdate={onEventUpdate}
                    onEventDelete={onEventDelete}
                    setIsAddEventPopupOpen={setIsAddEventPopupOpen}
                    isLoading={isLoading}
                    onDateRangeChange={onDateRangeChange}
                />
                : <MonthBasicView
                    filteredEvents={filteredEvents}
                    currentDate={currentDate}
                    is24HourFormat={is24HourFormat}
                    isAddEventPopupOpen={isAddEventPopupOpen}
                    currentConfig={currentConfig}
                    setCurrentDate={setCurrentDate}
                    setCurrentView={setCurrentView}
                    onEventAdd={onEventAdd}
                    onEventUpdate={onEventUpdate}
                    onEventDelete={onEventDelete}
                    setIsAddEventPopupOpen={setIsAddEventPopupOpen}
                    isLoading={isLoading}
                    onDateRangeChange={onDateRangeChange}
                />
            }
        </>
    );
};

export default MonthView;
