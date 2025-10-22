import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const nbNO: EventCalendarTranslations = {
  // Locale information
  language: "nb",
  
  // Time and date
  today: "I dag",
  thisWeek: "Denne uken",
  thisMonth: "Denne måneden",
  thisYear: "Dette året",
  dayNames: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
  fullDayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
  monthNames: [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],

  // Views
  viewBy: "Vis etter",
  day: "Dag",
  week: "Uke",
  month: "Måned",
  year: "År",
  list: "Liste",

  // Event actions
  addEvent: "Ny hendelse",
  editEvent: "Rediger hendelse",
  deleteEvent: "Slett hendelse",
  eventTitle: "Hendelsestittel",
  eventDescription: "Beskrivelse",
  eventColor: "Farge",
  eventDate: "Dato",
  eventStartTime: "Starttid",
  eventEndTime: "Sluttid",
  eventEndDate: "Sluttdato",
  eventIsRepeating: "Gjentakende hendelse",

  // Success messages
  eventAdded: "Hendelse lagt til",
  eventUpdated: "Hendelse oppdatert",
  eventDeleted: "Hendelse slettet",
  eventRestored: "Hendelse gjenopprettet",
  eventUpdateUndone: "Hendelsesoppdatering angret",

  // Error messages
  failedToAddEvent: "Kunne ikke legge til hendelse",
  failedToUpdateEvent: "Kunne ikke oppdatere hendelse",
  failedToDeleteEvent: "Kunne ikke slette hendelse",
  failedToFetchEvents: "Kunne ikke hente hendelser",
  errorCannotExcludeAllDates: "Kan ikke utelukke alle datoer i området",

  // Actions
  save: "Lagre",
  saving: "Lagrer",
  cancel: "Avbryt",
  delete: "Slett",
  deleting: "Sletter",
  undo: "Angre",
  tryAgain: "Prøv igjen",
  close: "Lukk",

  // Other UI elements
  search: "Søk",
  searchEvents: "Søk i hendelser...",
  noEvents: "Ingen hendelser",
  allDay: "Hele dagen",
  fullDayEvents: "Heldagshendelser",
  loadingEvents: "Laster hendelser...",
  filterByColor: "Filtrer etter farge",
  filter: "Filter",
  filtering: "Filtrerer",
  more: "mer",

  // Time format
  use24HourFormat: "Bruk 24-timers format",

  // Tooltips
  repeatingEvent: "Gjentakende hendelse",
  multiDayEvent: "Flerdagshendelse",
  extendsOutOfRange: "Strekker seg utover gjeldende visning",
  displayCalendar: "Vis kalender",
  displayList: "Vis liste",

  // Event context
  dayXofY: "Dag {x} av {y}",
  repeatXofY: "#{x} av {y}",
  starts: "Starter",
  ends: "Slutter",
  untitledEvent: "Hendelse uten tittel",

  // Repeating Events
  repeatDaily: "Daglig",
  repeatWeekly: "Ukentlig",
  repeatMonthly: "Månedlig",
  repeatingEventQuestion: "Gjentagende hendelse?",
  repeatDailyDescription:
    "Gjentas daglig kl. {timeRange} fra {startDate} til {endDate}",
  repeatWeeklyDescription:
    "Gjentas hver {dayName} kl. {timeRange} fra {startDate} til {endDate}",
  repeatMonthlyDescription:
    "Gjentas den {dayOfMonth}. hver måned kl. {timeRange} fra {startDate} til {endDate}",
  withExcludedDates: "med {count} utelukket dato{s}",
    
  // Repeating event excluded dates
  excludedDates: "Utelukkede datoer?",
  excludedDatesDescription: "Velg datoer for å utelukke fra det gjentakende mønsteret",
  skipDays: "Hopp over dager:",
  clearAll: "Fjern alle",
  selectDatesToExclude: "Velg datoer å utelukke",
  selectAll: "Velg alle",
  noMatchingDates: "Ingen datoer samsvarer med dette gjentakelsesmønsteret",
  noSearchResults: "Ingen resultater funnet for \"{query}\"",
  searchMonthPlaceholder: "Søk måned...",
  ofExcluded: "{count} av {total} utelukket",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Hver {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "Den {dayOfMonth}. hver måned ({startDate} - {endDate})",
  dateButtonFormat: "d. MMM",

  // Dialog descriptions
  editEventDescription: "Rediger hendelsesdetaljene dine.",
  createEventDescription: "Opprett en ny hendelse i kalenderen din.",

  // Time presets
  timePresetAllDay: "Hele dagen",
  timePresetEarlyMorning: "Tidlig morgen",
  timePresetMorning: "Morgen",
  timePresetLunch: "Lunsj",
  timePresetEarlyAfternoon: "Tidlig ettermiddag",
  timePresetLateAfternoon: "Sen ettermiddag",
  timePresetEvening: "Kveld",
  timePresetNight: "Natt",

  // Additional dialog related strings
  selectDate: "Velg en dato",
  selectColor: "Velg en farge",
  confirmDelete: "Er du sikker?",
  confirmDeleteDescription: "Vil du slette denne hendelsen?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Slett gjentakende hendelse",
  repeatEventDeleteDescription: "Dette er en gjentakende hendelse. Hva ønsker du å slette?",
  deleteThisOccurrence: "Slett kun denne forekomsten",
  deleteThisAndFuture: "Slett denne og alle fremtidige forekomster",
  deleteAllOccurrences: "Slett alle forekomster",
  deleteThisOccurrenceDescription: "Kun denne spesifikke datoen vil bli fjernet",
  deleteThisAndFutureDescription: "Denne og alle fremtidige datoer vil bli fjernet",
  deleteAllOccurrencesDescription: "Hele den gjentakende hendelsen vil bli fjernet",
  
  // Recurring event editing
  editRecurringEventTitle: "Rediger gjentakende hendelse",
  editRecurringEventDescription: "Dette er en gjentakende hendelse. Ønsker du å redigere alle forekomster, bare denne, eller denne og fremtidige forekomster?",
  editThisOccurrence: "Rediger kun denne forekomsten",
  editThisOccurrenceDescription: "Gjør endringer kun for denne spesifikke hendelsesforekomsten",
  editThisAndFuture: "Rediger denne og fremtidige forekomster",
  editThisAndFutureDescription: "Gjør endringer for denne og alle fremtidige forekomster",
  editAllOccurrences: "Rediger alle forekomster",
  editAllOccurrencesDescription: "Gjør endringer for alle forekomster av denne hendelsen",
  from: "fra",
  to: "til",
  pickADate: "Velg en dato",
  errorEndDateBeforeStart: "Sluttdato kan ikke være før startdato",
  selectAColor: "Velg en farge",

  // Form validations
  validations: {
    eventNameRequired: "Hendelsestittel er påkrevd",
    invalidTimeFormat: "Ugyldig tidsformat",
    colorRequired: "Farge er påkrevd",
    endTimeBeforeStart: "Sluttid kan ikke være før starttid",
  },
};
