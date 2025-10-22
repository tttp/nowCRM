export interface EventCalendarTranslations {
  // Locale information
  language: string; // e.g., 'enUS', 'sv', 'fr', etc.
  
  // Time and date
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  dayNames: string[];
  fullDayNames: string[];
  monthNames: string[];

  // Views
  viewBy: string;
  day: string;
  week: string;
  month: string;
  year: string;
  list: string;

  // Event actions
  addEvent: string;
  editEvent: string;
  deleteEvent: string;
  eventTitle: string;
  eventDescription: string;
  eventColor: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventEndDate: string;
  eventIsRepeating: string;

  // Success messages
  eventAdded: string;
  eventUpdated: string;
  eventDeleted: string;
  eventRestored: string;
  eventUpdateUndone: string;

  // Error messages
  failedToAddEvent: string;
  failedToUpdateEvent: string;
  failedToDeleteEvent: string;
  failedToFetchEvents: string;
  errorCannotExcludeAllDates: string;

  // Actions
  save: string;
  saving: string;
  cancel: string;
  delete: string;
  deleting: string;
  undo: string;
  tryAgain: string;
  close: string;

  // Other UI elements
  search: string;
  searchEvents: string;
  noEvents: string;
  allDay: string;
  fullDayEvents: string;
  loadingEvents: string;
  filterByColor: string;
  filter: string;
  filtering: string;
  more: string;

  // Time format
  use24HourFormat: string;

  // Tooltips
  repeatingEvent: string;
  multiDayEvent: string;
  extendsOutOfRange: string;
  displayCalendar: string;
  displayList: string;

  // Event context
  dayXofY: string; // "Day {x} of {y}"
  repeatXofY: string; // "#{x} of {y}"
  starts: string;
  ends: string;
  untitledEvent: string;

  repeatDaily: string;
  repeatWeekly: string;
  repeatMonthly: string;
  repeatDailyDescription: string; // "Repeats daily at {timeRange} from {startDate} to {endDate}"
  repeatWeeklyDescription: string; // "Repeats every {dayName} at {timeRange} from {startDate} to {endDate}"
  repeatMonthlyDescription: string; // "Repeats on the {dayOfMonth} of each month at {timeRange} from {startDate} to {endDate}"
  repeatingEventQuestion: string; // "Repeating Event?"
  
  // Repeating event excluded dates
  withExcludedDates: string; // "with {count} excluded date(s)"
  excludedDates: string; // "Excluded Dates"
  excludedDatesDescription: string; // "Select dates to exclude from the recurring pattern"
  skipDays: string; // "Skip Days:"
  clearAll: string; // "Clear All"
  selectDatesToExclude: string; // "Select dates to exclude"
  selectAll: string; // "Select All"
  noMatchingDates: string; // "No dates match this repeat pattern"
  noSearchResults: string; // "No matches found for "{query}""
  searchMonthPlaceholder: string; // "Search month..."
  ofExcluded: string; // "{count} of {total} excluded"
  pageCount: string; // "{current}/{total}"
  weeklyIntervalLabel: string; // "Repeats on {dayName}s ({startDate} - {endDate})"
  monthlyIntervalLabel: string; // "Repeats on the {dayOfMonth} of each month ({startDate} - {endDate})"
  dateButtonFormat: string; // Format string for date buttons

  // Dialog descriptions
  editEventDescription: string; // "Edit your event details."
  createEventDescription: string; // "Create a new event in your calendar."

  // Time presets
  timePresetAllDay: string;
  timePresetEarlyMorning: string;
  timePresetMorning: string;
  timePresetLunch: string;
  timePresetEarlyAfternoon: string;
  timePresetLateAfternoon: string;
  timePresetEvening: string;
  timePresetNight: string;

  // Additional dialog related strings
  selectDate: string; // "Pick a date"
  selectColor: string; // "Select a color"
  confirmDelete: string; // "Are you sure?"
  confirmDeleteDescription: string; // "Do you want to delete this event?"
  from: string; // "from"
  to: string; // "to"

  // Repeating event edit/delete dialogs
  repeatEventDeleteTitle: string; // "Delete Repeating Event"
  repeatEventDeleteDescription: string; // "This is a repeating event. What would you like to delete?"
  deleteThisOccurrence: string; // "Delete only this occurrence"
  deleteThisAndFuture: string; // "Delete this and all future occurrences"
  deleteAllOccurrences: string; // "Delete all occurrences"
  deleteThisOccurrenceDescription: string; // "Only this specific date will be removed"
  deleteThisAndFutureDescription: string; // "This and all future dates will be removed"
  deleteAllOccurrencesDescription: string; // "The entire repeating event will be removed"
  
  // Recurring event editing
  editRecurringEventTitle: string; // "Edit Recurring Event"
  editRecurringEventDescription: string; // "This is a recurring event. Would you like to edit all occurrences, just this one, or this and future occurrences?"
  editThisOccurrence: string; // "Edit this occurrence only"
  editThisOccurrenceDescription: string; // "Make changes only to this specific event occurrence"
  editThisAndFuture: string; // "Edit this and future occurrences"
  editThisAndFutureDescription: string; // "Make changes to this and all future occurrences"
  editAllOccurrences: string; // "Edit all occurrences"
  editAllOccurrencesDescription: string; // "Make changes to all occurrences of this event"

  pickADate: string; // "Pick a date"
  errorEndDateBeforeStart: string; // "End date cannot be before start date"
  selectAColor: string; // "Select a color"
  validations: {
    eventNameRequired: string; // "Event name is required"
    invalidTimeFormat: string; // "Invalid time format"
    colorRequired: string; // "Color is required"
    endTimeBeforeStart: string; // "End time can't be before start time"
  };
}
