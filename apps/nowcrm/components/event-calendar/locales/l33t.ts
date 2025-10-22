import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const l33t: EventCalendarTranslations = {
  // Locale information
  language: "l33t",
  
  // Time and date
  today: "T0d4y",
  thisWeek: "D1s W33k",
  thisMonth: "D1s M0nth",
  thisYear: "D1s Y34r",
  dayNames: ["5un", "M0n", "Tu3", "W3d", "Thu", "Fr1", "54t"],
  fullDayNames: ["5und4y", "M0nd4y", "Tu35d4y", "W3dn35d4y", "Thur5d4y", "Fr1d4y", "54turd4y"],
  monthNames: [
    "J4nu4ry",
    "F3bru4ry",
    "M4rch",
    "4pr1l",
    "M4y",
    "Jun3",
    "Ju1y",
    "4ugu5t",
    "53pt3mb3r",
    "0ct0b3r",
    "N0v3mb3r",
    "D3c3mb3r",
  ],

  // Views
  viewBy: "V13w By",
  day: "D4y",
  week: "W33k",
  month: "M0nth",
  year: "Y34r",
  list: "L15t",

  // Event actions
  addEvent: "4dd 3v3nt",
  editEvent: "3d1t 3v3nt",
  deleteEvent: "D3l3t3 3v3nt",
  eventTitle: "3v3nt T1tl3",
  eventDescription: "D35cr1pt10n",
  eventColor: "3v3nt C0l0r",
  eventDate: "D4t3",
  eventStartTime: "5t4rt T1m3",
  eventEndTime: "3nd T1m3",
  eventEndDate: "3nd D4t3",
  eventIsRepeating: "R3p34t1ng 3v3nt",

  // Success messages
  eventAdded: "3v3nt 4dd3d",
  eventUpdated: "3v3nt upd4t3d",
  eventDeleted: "3v3nt pwn3d",
  eventRestored: "3v3nt r35t0r3d",
  eventUpdateUndone: "3v3nt upd4t3 und0n3",

  // Error messages
  failedToAddEvent: "F41l3d 2 4dd 3v3nt",
  failedToUpdateEvent: "F41l3d 2 upd4t3 3v3nt",
  failedToDeleteEvent: "F41l3d 2 pwn 3v3nt",
  failedToFetchEvents: "F41l3d 2 f3tch 3v3nt5",
  errorCannotExcludeAllDates: "C4nn0t 3xclud3 4ll d4t3z 1n r4ng3",

  // Actions
  save: "54v3",
  saving: "S4v1ng",
  cancel: "C4nc3l",
  delete: "Pwn",
  deleting: "D3l3t1ng",
  undo: "Und0",
  tryAgain: "Try 4g41n",
  close: "Cl053",

  // Other UI elements
  search: "534rch",
  searchEvents: "534rch 3v3nt5...",
  noEvents: "N0 3v3nt5",
  allDay: "4ll D4y",
  fullDayEvents: "Full-D4y 3v3nt5",
  loadingEvents: "L04d1ng 3v3nt5...",
  filterByColor: "F1lt3r by C0l0r",
  filter: "F1lt3r",
  filtering: "F1lt3r1ng",
  more: "m0r3",

  // Time format
  use24HourFormat: "U53 24-h0ur f0rm4t",

  // Tooltips
  repeatingEvent: "R3p34t1ng 3v3nt",
  multiDayEvent: "Mult1-d4y 3v3nt",
  extendsOutOfRange: "3xt3nd5 b3y0nd v13w",
  displayCalendar: "5h0w C4l3nd4r",
  displayList: "5h0w L15t",

  // Event context
  dayXofY: "D4y {x} 0f {y}",
  repeatXofY: "#{x} 0f {y}",
  starts: "5t4rt5",
  ends: "3nd5",
  untitledEvent: "Unt1tl3d 3v3nt",

  repeatDaily: "D41ly",
  repeatWeekly: "W33kly",
  repeatMonthly: "M0n7hly",
  repeatingEventQuestion: "R3p34t1ng 3v3n7?",
  repeatDailyDescription:
    "R3p34tz d41ly 47 {timeRange} fr0m {startDate} 70 {endDate}",
  repeatWeeklyDescription:
    "R3p34tz 3v3ry {dayName} 47 {timeRange} fr0m {startDate} 70 {endDate}",
  repeatMonthlyDescription:
    "R3p34tz 0n 7h3 {dayOfMonth} 0f 34ch m0n7h 47 {timeRange} fr0m {startDate} 70 {endDate}",
  withExcludedDates: "w17h {count} 3xclud3d d4t3{s}",
  
  // Repeating event excluded dates
  excludedDates: "3xclud3d D473z?",
  excludedDatesDescription: "53l3c7 d473z 2 3xclud3 fr0m r3curr1ng p4773rn",
  skipDays: "5k1p D4yz:",
  clearAll: "Cl34r 4ll",
  selectDatesToExclude: "53l3c7 d473z 2 3xclud3",
  selectAll: "53l3c7 4ll",
  noMatchingDates: "N0 d473z m47ch d15 r3p347 p4773rn",
  noSearchResults: "N0 m47ch3z f0und 4 \"{query}\"",
  searchMonthPlaceholder: "534rch m0n7h...",
  ofExcluded: "{count} 0f {total} 3xclud3d",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "{dayName}z ({startDate} - {endDate})",
  monthlyIntervalLabel: "{dayOfMonth} 0f 34ch m0n7h ({startDate} - {endDate})",
  dateButtonFormat: "MMM d",

  // Dialog descriptions
  editEventDescription: "3d1t ur 3v3nt d3t41l5",
  createEventDescription: "Cr34t3 4 n3w 3v3nt",

  // Time presets
  timePresetAllDay: "4ll D4y",
  timePresetEarlyMorning: "34rly M0rn1ng",
  timePresetMorning: "M0rn1ng",
  timePresetLunch: "Lunch T1m3",
  timePresetEarlyAfternoon: "34rly 4ft3rn00n",
  timePresetLateAfternoon: "L4t3 4ft3rn00n",
  timePresetEvening: "3v3n1ng",
  timePresetNight: "N1ght",

  // Additional dialog related strings
  selectDate: "P1ck 4 d4t3",
  selectColor: "53l3ct 4 c0l0r",
  confirmDelete: "U 5ur3?",
  confirmDeleteDescription: "U w4nt 2 pwn d15 3v3nt?",
  // Repeating event deletion
  repeatEventDeleteTitle: "D3l3t3 R3p34t1ng 3v3nt",
  repeatEventDeleteDescription: "D15 15 4 r3p34t1ng 3v3nt. Wh4t U w4nt 2 pwn?",
  deleteThisOccurrence: "Pwn 0nly d15 0ccurr3nc3",
  deleteThisAndFuture: "Pwn d15 & 4ll futur3 0ccurr3nc3z",
  deleteAllOccurrences: "Pwn 4ll 0ccurr3nc3z",
  deleteThisOccurrenceDescription: "0nly d15 5p3c1f1c d4t3 w1ll b3 r3m0v3d",
  deleteThisAndFutureDescription: "D15 & 4ll futur3 d4t3z w1ll b3 pwn3d",
  deleteAllOccurrencesDescription: "D4 3nt1r3 r3p34t1ng 3v3nt w1ll b3 pwn3d",
  
  // Recurring event editing
  editRecurringEventTitle: "3d1t R3p34t1ng 3v3nt",
  editRecurringEventDescription: "D15 15 4 r3curr1ng 3v3nt. W0uld U l1k3 2 3d1t 4ll 0ccurr3nc3z, ju5t d15 1, 0r d15 & futur3 0n3z?",
  editThisOccurrence: "3d1t d15 0ccurr3nc3 0nly",
  editThisOccurrenceDescription: "M4k3 ch4ng3z 0nly 2 d15 5p3c1f1c 3v3nt 0ccurr3nc3",
  editThisAndFuture: "3d1t d15 & futur3 0ccurr3nc3z",
  editThisAndFutureDescription: "M4k3 ch4ng3z 2 d15 & 4ll futur3 0ccurr3nc3z",
  editAllOccurrences: "3d1t 4ll 0ccurr3nc3z",
  editAllOccurrencesDescription: "M4k3 ch4ng3z 2 4ll 0ccurr3nc3z 0f d15 3v3nt",
  from: "fr0m",
  to: "2",
  pickADate: "P1ck 4 d4t3",
  errorEndDateBeforeStart: "3nd d4t3 c4nt b3 b4 5t4rt d4t3",
  selectAColor: "53l3ct 4 c0l0r",

  // Form validations
  validations: {
    eventNameRequired: "3v3nt n4m3 r3qu1r3d",
    invalidTimeFormat: "1nv4l1d t1m3 f0rm4t",
    colorRequired: "c0l0r r3qu1r3d",
    endTimeBeforeStart: "3nd t1m3 c4nt b3 b4 5t4rt t1m3",
  },
};
