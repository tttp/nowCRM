import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const enUS: EventCalendarTranslations = {
  // Locale information
  language: "enUS",
  
  // Time and date
  today: "Today",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  fullDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  
  // Views
  viewBy: "View by",
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
  list: "List",
  
  // Event actions
  addEvent: "Add Event",
  editEvent: "Edit Event",
  deleteEvent: "Delete Event",
  eventTitle: "Event Title",
  eventDescription: "Description",
  eventColor: "Event Color",
  eventDate: "Date",
  eventStartTime: "Start Time",
  eventEndTime: "End Time",
  eventEndDate: "End Date",
  eventIsRepeating: "Repeating Event",
  
  // Success messages
  eventAdded: "Event added",
  eventUpdated: "Event updated",
  eventDeleted: "Event deleted",
  eventRestored: "Event restored",
  eventUpdateUndone: "Event update undone",
  
  // Error messages
  failedToAddEvent: "Failed to add event",
  failedToUpdateEvent: "Failed to update event",
  failedToDeleteEvent: "Failed to delete event",
  failedToFetchEvents: "Failed to fetch events",
  errorCannotExcludeAllDates: "Cannot exclude all dates in the range",
  
  // Actions
  save: "Save",
  saving: "Saving",
  cancel: "Cancel",
  delete: "Delete",
  deleting: "Deleting",
  undo: "Undo",
  tryAgain: "Try again",
  close: "Close",
  
  // Other UI elements
  search: "Search",
  searchEvents: "Search events...",
  noEvents: "No events",
  allDay: "All Day",
  fullDayEvents: "Full-Day Events",
  loadingEvents: "Loading events...",
  filterByColor: "Filter by Color",
  filter: "Filter",
  filtering: "Filtering",
  more: "more",
  
  // Time format
  use24HourFormat: "Use 24-hour format",
  
  // Tooltips
  repeatingEvent: "Repeating event",
  multiDayEvent: "Multi-day event",
  extendsOutOfRange: "Extends beyond current view",
  displayCalendar: "Display Calendar",
  displayList: "Display List",
  
  // Event context
  dayXofY: "Day {x} of {y}",
  repeatXofY: "#{x} of {y}",
  starts: "Starts",
  ends: "Ends",
  untitledEvent: "Untitled Event",

  // Repeating Events
  repeatDaily: "Daily",
  repeatWeekly: "Weekly",
  repeatMonthly: "Monthly",
  repeatingEventQuestion: "Repeating Event?",
  repeatDailyDescription: "Repeats daily at {timeRange} from {startDate} to {endDate}",
  repeatWeeklyDescription: "Repeats every {dayName} at {timeRange} from {startDate} to {endDate}",
  repeatMonthlyDescription: "Repeats on the {dayOfMonth} of each month at {timeRange} from {startDate} to {endDate}",
  withExcludedDates: "with {count} excluded date{s}",
  
  // Repeating event excluded dates
  excludedDates: "Excluded Dates?",
  excludedDatesDescription: "Select dates to exclude from the recurring pattern",
  skipDays: "Skip Days:",
  clearAll: "Clear All",
  selectDatesToExclude: "Select dates to exclude",
  selectAll: "Select All",
  noMatchingDates: "No dates match this repeat pattern",
  noSearchResults: "No matches found for \"{query}\"",
  searchMonthPlaceholder: "Search month...",
  ofExcluded: "{count} of {total} excluded",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "{dayName}s ({startDate} - {endDate})",
  monthlyIntervalLabel: "{dayOfMonth} of each month ({startDate} - {endDate})",
  dateButtonFormat: "MMM d",

  // Dialog descriptions
  editEventDescription: "Edit your event details.",
  createEventDescription: "Create a new event in your calendar.",
  
  // Time presets
  timePresetAllDay: "All Day",
  timePresetEarlyMorning: "Early Morning",
  timePresetMorning: "Morning",
  timePresetLunch: "Lunch",
  timePresetEarlyAfternoon: "Early Afternoon",
  timePresetLateAfternoon: "Late Afternoon",
  timePresetEvening: "Evening",
  timePresetNight: "Night",
  
  // Additional dialog related strings
  selectDate: "Pick a date",
  selectColor: "Select a color",
  confirmDelete: "Are you sure?",
  confirmDeleteDescription: "Do you want to delete this event?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Delete Repeating Event",
  repeatEventDeleteDescription: "This is a repeating event. What would you like to delete?",
  deleteThisOccurrence: "Delete only this occurrence",
  deleteThisAndFuture: "Delete this and all future occurrences",
  deleteAllOccurrences: "Delete all occurrences",
  deleteThisOccurrenceDescription: "Only this specific date will be removed",
  deleteThisAndFutureDescription: "This and all future dates will be removed",
  deleteAllOccurrencesDescription: "The entire repeating event will be removed",
  
  // Recurring event editing
  editRecurringEventTitle: "Edit Recurring Event",
  editRecurringEventDescription: "This is a recurring event. Would you like to edit all occurrences, just this one, or this and future occurrences?",
  editThisOccurrence: "Edit this occurrence only",
  editThisOccurrenceDescription: "Make changes only to this specific event occurrence",
  editThisAndFuture: "Edit this and future occurrences",
  editThisAndFutureDescription: "Make changes to this and all future occurrences",
  editAllOccurrences: "Edit all occurrences",
  editAllOccurrencesDescription: "Make changes to all occurrences of this event",
  from: "from",
  to: "to",
  pickADate: "Pick a date",
  errorEndDateBeforeStart: "End date cannot be before start date",
  selectAColor: "Select a color",
  // Dialog Form validations
  validations: {
    eventNameRequired: "Event name is required",
    invalidTimeFormat: "Invalid time format",
    colorRequired: "Color is required",
    endTimeBeforeStart: "End time can't be before start time"
  }
};
