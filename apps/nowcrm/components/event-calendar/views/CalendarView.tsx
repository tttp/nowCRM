"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCalendarConfigType, CalendarEventType, CalendarViewType } from '../types';
// import { useCurrentTimeLine } from '../hooks/useCurrentTimeLine';
import { useDateRange } from '../hooks/useDateRange';
// import DayView from './DayView/DayView';
// import WeekView from './WeekView/WeekView';
import MonthView from './MonthView/MonthView';
import YearView from './YearView/YearView';
import ListView from './ListView/ListView';

interface CalendarViewProps {
    currentView: CalendarViewType;
    isListView: boolean;
    animationDirection: 'up' | 'down';
    currentDate: Date;
    filteredEvents: CalendarEventType[];
    listSearchTerm: string;
    setListSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    currentConfig: EventCalendarConfigType;
    onEventUpdate: (event: CalendarEventType) => Promise<void>;
    onEventDelete: (eventId: string) => Promise<void>;
    isLoading: boolean;
    onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
    is24HourFormat: boolean;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
    onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    currentView,
    isListView,
    animationDirection,
    currentDate,
    filteredEvents,
    listSearchTerm,
    setListSearchTerm,
    currentConfig,
    onEventUpdate,
    onEventDelete,
    isLoading,
    onEventAdd,
    is24HourFormat,
    setCurrentDate,
    setCurrentView,
    onDateRangeChange,
}) => {
    // Current View Render States & References
    const [isAddEventPopupOpen, setIsAddEventPopupOpen] = useState(false);
    // const [clickedTime, setClickedTime] = useState<string | null>(null);
    // const hoverLineRef = useRef<HTMLDivElement>(null);
    // const hoverTimeRef = useRef<HTMLSpanElement>(null);
    // const currentTimeLineRef = useRef<HTMLDivElement>(null);
    // const currentTimeTop = useCurrentTimeLine();

    useDateRange({
        currentView,
        currentDate,
        onDateRangeChange,
        is24HourFormat
    });

    const baseProps = { filteredEvents, currentDate, currentConfig, onEventUpdate, onEventDelete, onEventAdd, is24HourFormat, isLoading };
    const viewProps = { isAddEventPopupOpen, setIsAddEventPopupOpen, onDateRangeChange };
    // const hoverTimeLineRefs = { hoverLineRef, hoverTimeRef };
    // const clickedTimeState = { clickedTime, setClickedTime };
    // const currentTimeLineRefs = { currentTimeLineRef, currentTimeTop };
    const currentViewSetStates = { setCurrentDate, setCurrentView }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${currentView}-${currentDate.toISOString()}`}
                initial={{
                    opacity: 0,
                    y: animationDirection === 'up' ? -20 : animationDirection === 'down' ? 20 : 0
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{
                    opacity: 0,
                    y: animationDirection === 'up' ? 20 : animationDirection === 'down' ? -20 : 0
                }}
                transition={{ duration: 0.1 }}
                className="h-full"
            >
                {isListView ? (
                    <ListView
                        {...baseProps}
                        currentView={currentView}
                        listSearchTerm={listSearchTerm}
                        setListSearchTerm={setListSearchTerm}
                    />
                ) : (
                    <>
                        {/* {currentView === 'day' && (
                            <DayView
                                {...baseProps}
                                {...viewProps}
                                {...hoverTimeLineRefs}
                                {...clickedTimeState}
                                {...currentTimeLineRefs}
                            />
                        )} */}
                        {/* {currentView === 'week' && (
                            <WeekView
                                {...baseProps}
                                {...viewProps}
                                {...hoverTimeLineRefs}
                                {...clickedTimeState}
                                {...currentTimeLineRefs}
                                {...currentViewSetStates}
                            />
                        )} */}
                        {currentView === 'month' && (
                            <MonthView
                                {...baseProps}
                                {...viewProps}
                                {...currentViewSetStates}
                            />
                        )}
                        {currentView === 'year' && (
                            <YearView
                                {...baseProps}
                                {...viewProps}
                                {...currentViewSetStates}
                            />
                        )}
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default CalendarView;
