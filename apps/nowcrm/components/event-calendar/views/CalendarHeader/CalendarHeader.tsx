"use client";

/**
 * CalendarHeader Component
 * 
 * A comprehensive header component for the EventCalendar that provides view controls
 * and various calendar management options.
 * 
 * Core Features:
 * 1. View Management
 *    - Toggle between Day/Week/Month/Year views
 *    - List view toggle
 *    - Animated view transitions
 * 
 * 2. Calendar Controls  
 *    - Time format toggle (12/24 hour)
 *    - Color filtering for events
 *    - Add event functionality
 *    - Responsive design with mobile support
 * 
 * Sub-Components:
 * - TimeFormatToggle: Toggles between 12/24 hour format
 * - ColorFilter: Manages event color filtering
 * - TodayButton: Quick navigation to current period
 * - ListViewToggle: Switches between calendar and list views
 * - ViewSelector: Manages calendar view type selection
 * - AddEventPopup: Handles new event creation
 * - DateNavigation: Handles date navigation and switching
 */

import { Grid, LayoutGrid } from 'lucide-react';
import { CalendarViewType } from '../../types/CalendarViewType';
import { CalendarEventType } from '../../types/CalendarEventType';
import { Month } from '../../switchers/MonthSwitcher';
import { isSameDay, isSameMonth, startOfWeek } from 'date-fns';
import { TimeFormatToggle } from './components/TimeFormatToggle';
import { ColorFilter } from './components/ColorFilter';
import { TodayButton } from './components/TodayButton';
import { ListViewToggle } from './components/ListViewToggle';
import { ViewSelector } from './components/ViewSelector';
import { CalendarViewHeaderViewOption } from '../../types/ViewOption';
import { useState } from 'react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import DateNavigation from './components/DateNavigation';
import { EventCalendarConfigType } from '../../types';
import EventPopup from '../../popups/EventPopup/EventPopup';

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: CalendarViewType;
  handlePrevious: () => void;
  handleNext: () => void;
  handleTodayClick: () => void;
  toggleTimeFormat: () => void;
  setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
  isTimeFormatChanging: boolean;
  use24HourFormat: boolean;
  lastUpdated: "day" | "month" | "year" | null;
  animationDirection: 'up' | 'down';
  months: Month[];
  handleDayChange: (date: Date) => void;
  handleMonthChange: (month: Month) => void;
  handleYearChange: (year: number) => void;
  currentConfig: EventCalendarConfigType;
  onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
  onEventDelete: (eventId: string) => Promise<void>;
  isListView: boolean;
  setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  currentView,
  handlePrevious,
  handleNext,
  handleTodayClick,
  toggleTimeFormat,
  setCurrentView,
  isTimeFormatChanging,
  use24HourFormat,
  lastUpdated,
  animationDirection,
  months,
  handleDayChange,
  handleMonthChange,
  handleYearChange,
  currentConfig,
  onEventAdd,
  onEventDelete,
  isListView,
  setIsListView,
  selectedColors,
  setSelectedColors,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useKeyboardNavigation({ handleNext, handlePrevious });

  const viewOptions: CalendarViewHeaderViewOption[] = [
    //tempo remove day and week untill fixed
    // { value: 'day' as CalendarViewType, label: currentConfig.localization!.day, icon: List },
    // { value: 'week' as CalendarViewType, label: currentConfig.localization!.week, icon: Columns },
    { value: 'month' as CalendarViewType, label: currentConfig.localization!.month, icon: Grid },
    { value: 'year' as CalendarViewType, label: currentConfig.localization!.year, icon: LayoutGrid },
  ];

  const toggleColorSelection = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const getPreSelectedDates = (): Partial<CalendarEventType> => {
    switch (currentView) {
      // case 'day':
      //   return {
      //     startDate: currentDate,
      //     endDate: currentDate
      //   };
      // case 'week':
      //   return {
      //     startDate: startOfWeek(currentDate, { weekStartsOn: use24HourFormat ? 1 : 0 }),
      //     endDate: endOfWeek(currentDate, { weekStartsOn: use24HourFormat ? 1 : 0 })
      //   }
      default:
        return {
          publish_date: currentDate,
        }
    }
  };

  const isTodayDisabled = () => {
    const today = new Date();
    switch (currentView) {
      case 'day':
        return isSameDay(currentDate, today);
      case 'week':
        return isSameDay(
          startOfWeek(currentDate, { weekStartsOn: use24HourFormat ? 1 : 0 }),
          startOfWeek(today, { weekStartsOn: use24HourFormat ? 1 : 0 })
        );
      case 'month':
        return isSameMonth(currentDate, today);
      case 'year':
        return currentDate.getFullYear() === today.getFullYear();
      default:
        return false;
    }
  };

  const getTodayButtonText = () => {
    switch (currentView) {
      case 'day':
        return currentConfig.localization!.today;
      case 'week':
        return currentConfig.localization!.thisWeek;
      case 'month':
        return currentConfig.localization!.thisMonth;
      case 'year':
        return currentConfig.localization!.thisYear;
      default:
        return currentConfig.localization!.today;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
      <DateNavigation
        currentDate={currentDate}
        currentView={currentView}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        lastUpdated={lastUpdated}
        animationDirection={animationDirection}
        months={months}
        handleDayChange={handleDayChange}
        handleMonthChange={handleMonthChange}
        handleYearChange={handleYearChange}
        currentConfig={currentConfig}
      />

      <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
        <TimeFormatToggle
          is24HourFormat={use24HourFormat}
          isTimeFormatChanging={isTimeFormatChanging}
          toggleTimeFormat={toggleTimeFormat}
        />

        <ColorFilter
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          selectedColors={selectedColors}
          toggleColorSelection={toggleColorSelection}
          currentConfig={currentConfig}
        />

        <TodayButton
          handleTodayClick={handleTodayClick}
          isTodayDisabled={isTodayDisabled()}
          getTodayButtonText={getTodayButtonText}
        />

        <ListViewToggle
          isListView={isListView}
          setIsListView={setIsListView}
          currentConfig={currentConfig}
        />

        <ViewSelector
          currentView={currentView}
          setCurrentView={setCurrentView}
          viewOptions={viewOptions}
          currentConfig={currentConfig}
        />

        <EventPopup
          translations={currentConfig.localization!}
          event={getPreSelectedDates()}
          onAddEvent={onEventAdd}
          onDeleteEvent={onEventDelete}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
