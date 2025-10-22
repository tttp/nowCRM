import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const svSE: EventCalendarTranslations = {
  // Locale information
  language: "svSE",
  
  // Time and date
  today: "Idag",
  thisWeek: "Denna vecka",
  thisMonth: "Denna månad",
  thisYear: "Detta år",
  dayNames: ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
  fullDayNames: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
  monthNames: [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ],

  // Views
  viewBy: "Visa efter",
  day: "Dag",
  week: "Vecka",
  month: "Månad",
  year: "År",
  list: "Lista",

  // Event actions
  addEvent: "Ny händelse",
  editEvent: "Redigera händelse",
  deleteEvent: "Ta bort händelse",
  eventTitle: "Händelsetitel",
  eventDescription: "Beskrivning",
  eventColor: "Händelsefärg",
  eventDate: "Startar",
  eventStartTime: "Klockan",
  eventEndTime: "Klockan",
  eventEndDate: "Slutar",
  eventIsRepeating: "Återkommande händelse",

  // Success messages
  eventAdded: "Händelse tillagd",
  eventUpdated: "Händelse uppdaterad",
  eventDeleted: "Händelse borttagen",
  eventRestored: "Händelse återställd",
  eventUpdateUndone: "Händelseuppdatering ångrad",

  // Error messages
  failedToAddEvent: "Kunde inte lägga till händelse",
  failedToUpdateEvent: "Kunde inte uppdatera händelse",
  failedToDeleteEvent: "Kunde inte ta bort händelse",
  failedToFetchEvents: "Kunde inte hämta händelser",
  errorCannotExcludeAllDates: "Kan inte undanta alla datum i intervallen",

  // Actions
  save: "Spara",
  saving: "Sparar",
  cancel: "Avbryt",
  delete: "Ta bort",
  deleting: "Raderar",
  undo: "Ångra",
  tryAgain: "Försök igen",
  close: "Stäng",

  // Other UI elements
  search: "Sök",
  searchEvents: "Sök händelser...",
  noEvents: "Inga händelser",
  allDay: "Heldag",
  fullDayEvents: "Heldagshändelser",
  loadingEvents: "Laddar händelser...",
  filterByColor: "Filtrera efter färg",
  filter: "Filtrera",
  filtering: "Filtrerar",
  more: "mer",

  // Time format
  use24HourFormat: "Använd 24-timmarsformat",

  // Tooltips
  repeatingEvent: "Återkommande händelse",
  multiDayEvent: "Flerdagshändelse",
  extendsOutOfRange: "Sträcker sig utanför aktuell vy",
  displayCalendar: "Visa kalender",
  displayList: "Visa lista",

  // Event context
  dayXofY: "Dag {x} av {y}",
  repeatXofY: "#{x} av {y}",
  starts: "Börjar",
  ends: "Slutar",
  untitledEvent: "Namnlös händelse",

  repeatDaily: "Dagligen",
  repeatWeekly: "Veckovis",
  repeatMonthly: "Månadsvis",
  repeatingEventQuestion: "Återkommande händelse?",
  repeatDailyDescription:
    "Upprepas dagligen kl. {timeRange} från {startDate} till {endDate}",
  repeatWeeklyDescription:
    "Upprepas varje {dayName} kl. {timeRange} från {startDate} till {endDate}",
  repeatMonthlyDescription:
    "Upprepas den {dayOfMonth}:e varje månad kl. {timeRange} från {startDate} till {endDate}",
  withExcludedDates: "med {count} undantagna datum",
    
  // Repeating event excluded dates
  excludedDates: "Undantagna datum?",
  excludedDatesDescription: "Välj datum att undanta från det återkommande mönstret",
  skipDays: "Hoppa över dagar:",
  clearAll: "Rensa alla",
  selectDatesToExclude: "Välj datum att undanta",
  selectAll: "Välj alla",
  noMatchingDates: "Inga datum matchar detta upprepningsmönster",
  noSearchResults: "Inga resultat hittades för \"{query}\"",
  searchMonthPlaceholder: "Sök månad...",
  ofExcluded: "{count} av {total} undantagna",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Varje {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "Den {dayOfMonth}:e varje månad ({startDate} - {endDate})",
  dateButtonFormat: "d MMM",

  // Dialog descriptions
  editEventDescription: "Redigera dina händelsedetaljer.",
  createEventDescription: "Skapa en ny händelse i din kalender.",

  // Time presets
  timePresetAllDay: "Heldag",
  timePresetEarlyMorning: "Tidig morgon",
  timePresetMorning: "Morgon",
  timePresetLunch: "Lunch",
  timePresetEarlyAfternoon: "Tidig eftermiddag",
  timePresetLateAfternoon: "Sen eftermiddag",
  timePresetEvening: "Kväll",
  timePresetNight: "Natt",

  // Additional dialog related strings
  selectDate: "Välj ett datum",
  selectColor: "Välj en färg",
  confirmDelete: "Är du säker?",
  confirmDeleteDescription: "Vill du ta bort den här händelsen?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Ta bort återkommande händelse",
  repeatEventDeleteDescription: "Detta är en återkommande händelse. Vad vill du ta bort?",
  deleteThisOccurrence: "Ta bort endast denna förekomst",
  deleteThisAndFuture: "Ta bort denna och alla framtida förekomster",
  deleteAllOccurrences: "Ta bort alla förekomster",
  deleteThisOccurrenceDescription: "Endast detta specifika datum kommer att tas bort",
  deleteThisAndFutureDescription: "Detta och alla framtida datum kommer att tas bort",
  deleteAllOccurrencesDescription: "Hela den återkommande händelsen kommer att tas bort",
  
  // Recurring event editing
  editRecurringEventTitle: "Redigera återkommande händelse",
  editRecurringEventDescription: "Detta är en återkommande händelse. Vill du redigera alla förekomster, bara denna, eller denna och framtida förekomster?",
  editThisOccurrence: "Redigera endast denna förekomst",
  editThisOccurrenceDescription: "Gör ändringar endast för denna specifika händelseförekomst",
  editThisAndFuture: "Redigera denna och framtida förekomster",
  editThisAndFutureDescription: "Gör ändringar för denna och alla framtida förekomster",
  editAllOccurrences: "Redigera alla förekomster",
  editAllOccurrencesDescription: "Gör ändringar för alla förekomster av denna händelse",
  from: "från",
  to: "till",
  pickADate: "Välj ett datum",
  errorEndDateBeforeStart: "Slutdatum kan inte vara före startdatum",
  selectAColor: "Välj en färg",

  // Form validations
  validations: {
    eventNameRequired: "Händelsetitel krävs",
    invalidTimeFormat: "Ogiltigt tidsformat",
    colorRequired: "Färg krävs",
    endTimeBeforeStart: "Sluttid kan inte vara före starttid",
  },
};
