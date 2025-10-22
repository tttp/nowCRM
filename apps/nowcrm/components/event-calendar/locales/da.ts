import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const da: EventCalendarTranslations = {
  // Locale information
  language: "da",
  
  // Time and date
  today: "I dag",
  thisWeek: "Denne uge",
  thisMonth: "Denne måned",
  thisYear: "Dette år",
  dayNames: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
  fullDayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
  monthNames: [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ],

  // Views
  viewBy: "Vis efter",
  day: "Dag",
  week: "Uge",
  month: "Måned",
  year: "År",
  list: "Liste",

  // Event actions
  addEvent: "Ny begivenhed",
  editEvent: "Rediger begivenhed",
  deleteEvent: "Slet begivenhed",
  eventTitle: "Begivenhedstitel",
  eventDescription: "Beskrivelse",
  eventColor: "Farve",
  eventDate: "Dato",
  eventStartTime: "Starttidspunkt",
  eventEndTime: "Sluttidspunkt",
  eventEndDate: "Slutdato",
  eventIsRepeating: "Gentaget begivenhed",

  // Success messages
  eventAdded: "Begivenhed tilføjet",
  eventUpdated: "Begivenhed opdateret",
  eventDeleted: "Begivenhed slettet",
  eventRestored: "Begivenhed gendannet",
  eventUpdateUndone: "Begivenhedsopdatering fortrudt",

  // Error messages
  failedToAddEvent: "Kunne ikke tilføje begivenhed",
  failedToUpdateEvent: "Kunne ikke opdatere begivenhed",
  failedToDeleteEvent: "Kunne ikke slette begivenhed",
  failedToFetchEvents: "Kunne ikke hente begivenheder",
  errorCannotExcludeAllDates: "Kan ikke udelukke alle datoer i området",

  // Actions
  save: "Gem",
  saving: "Gemmer",
  cancel: "Annuller",
  delete: "Slet",
  deleting: "Sletter",
  undo: "Fortryd",
  tryAgain: "Prøv igen",
  close: "Luk",

  // Other UI elements
  search: "Søg",
  searchEvents: "Søg i begivenheder...",
  noEvents: "Ingen begivenheder",
  allDay: "Hele dagen",
  fullDayEvents: "Heldagsbegivenheder",
  loadingEvents: "Indlæser begivenheder...",
  filterByColor: "Filtrer efter farve",
  filter: "Filter",
  filtering: "Filtrerer",
  more: "mere",

  // Time format
  use24HourFormat: "Brug 24-timers format",

  // Tooltips
  repeatingEvent: "Gentaget begivenhed",
  multiDayEvent: "Flerdagesbegivenhed",
  extendsOutOfRange: "Strækker sig ud over den aktuelle visning",
  displayCalendar: "Vis kalender",
  displayList: "Vis liste",

  // Event context
  dayXofY: "Dag {x} af {y}",
  repeatXofY: "#{x} af {y}",
  starts: "Starter",
  ends: "Slutter",
  untitledEvent: "Unavngiven begivenhed",

  // Repeating Events
  repeatDaily: "Dagligt",
  repeatWeekly: "Ugentligt",
  repeatMonthly: "Månedligt",
  repeatingEventQuestion: "Gentages begivenhed?",
  repeatDailyDescription:
    "Gentages dagligt kl. {timeRange} fra {startDate} til {endDate}",
  repeatWeeklyDescription:
    "Gentages hver {dayName} kl. {timeRange} fra {startDate} til {endDate}",
  repeatMonthlyDescription:
    "Gentages den {dayOfMonth}. hver måned kl. {timeRange} fra {startDate} til {endDate}",
  withExcludedDates: "med {count} udelukket dato{s}",
    
  // Repeating event excluded dates
  excludedDates: "Udelukkede datoer?",
  excludedDatesDescription: "Vælg datoer, der skal udelukkes fra det tilbagevendende mønster",
  skipDays: "Spring dage over:",
  clearAll: "Ryd alle",
  selectDatesToExclude: "Vælg datoer, der skal udelukkes",
  selectAll: "Vælg alle",
  noMatchingDates: "Ingen datoer matcher dette gentagelsesmønster",
  noSearchResults: "Ingen resultater fundet for \"{query}\"",
  searchMonthPlaceholder: "Søg måned...",
  ofExcluded: "{count} af {total} udelukket",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Hver {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "Den {dayOfMonth}. hver måned ({startDate} - {endDate})",
  dateButtonFormat: "d. MMM",

  // Dialog descriptions
  editEventDescription: "Rediger dine begivenhedsdetaljer.",
  createEventDescription: "Opret en ny begivenhed i din kalender.",

  // Time presets
  timePresetAllDay: "Hele dagen",
  timePresetEarlyMorning: "Tidlig morgen",
  timePresetMorning: "Morgen",
  timePresetLunch: "Frokost",
  timePresetEarlyAfternoon: "Tidlig eftermiddag",
  timePresetLateAfternoon: "Sen eftermiddag",
  timePresetEvening: "Aften",
  timePresetNight: "Nat",

  // Additional dialog related strings
  selectDate: "Vælg en dato",
  selectColor: "Vælg en farve",
  confirmDelete: "Er du sikker?",
  confirmDeleteDescription: "Vil du slette denne begivenhed?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Slet gentaget begivenhed",
  repeatEventDeleteDescription: "Dette er en gentaget begivenhed. Hvad vil du slette?",
  deleteThisOccurrence: "Slet kun denne forekomst",
  deleteThisAndFuture: "Slet denne og alle fremtidige forekomster",
  deleteAllOccurrences: "Slet alle forekomster",
  deleteThisOccurrenceDescription: "Kun denne specifikke dato vil blive fjernet",
  deleteThisAndFutureDescription: "Denne og alle fremtidige datoer vil blive fjernet",
  deleteAllOccurrencesDescription: "Hele den gentagne begivenhed vil blive fjernet",
  
  // Recurring event editing
  editRecurringEventTitle: "Rediger gentaget begivenhed",
  editRecurringEventDescription: "Dette er en gentaget begivenhed. Vil du redigere alle forekomster, kun denne eller denne og fremtidige forekomster?",
  editThisOccurrence: "Rediger kun denne forekomst",
  editThisOccurrenceDescription: "Foretag kun ændringer på denne specifikke begivenhedsforekomst",
  editThisAndFuture: "Rediger denne og fremtidige forekomster",
  editThisAndFutureDescription: "Foretag ændringer på denne og alle fremtidige forekomster",
  editAllOccurrences: "Rediger alle forekomster",
  editAllOccurrencesDescription: "Foretag ændringer på alle forekomster af denne begivenhed",
  from: "fra",
  to: "til",
  pickADate: "Vælg en dato",
  errorEndDateBeforeStart: "Slutdato kan ikke være før startdato",
  selectAColor: "Vælg en farve",
  validations: {
    eventNameRequired: "Begivenhedsnavn er påkrævet",
    invalidTimeFormat: "Ugyldigt tidsformat",
    colorRequired: "Farve er påkrævet",
    endTimeBeforeStart: "Sluttidspunkt kan ikke være før starttidspunkt",
  },
};
