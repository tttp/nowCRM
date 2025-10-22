import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const fr: EventCalendarTranslations = {
  // Locale information
  language: "fr",
  
  // Time and date
  today: "Aujourd'hui",
  thisWeek: "Cette semaine",
  thisMonth: "Ce mois",
  thisYear: "Cette année",
  dayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  fullDayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],

  // Views
  viewBy: "Afficher par",
  day: "Jour",
  week: "Semaine",
  month: "Mois",
  year: "Année",
  list: "Liste",

  // Event actions
  addEvent: "+ Événement",
  editEvent: "Modifier l'événement",
  deleteEvent: "Supprimer l'événement",
  eventTitle: "Titre de l'événement",
  eventDescription: "Description",
  eventColor: "Couleur",
  eventDate: "Date",
  eventStartTime: "Heure de début",
  eventEndTime: "Heure de fin",
  eventEndDate: "Date de fin",
  eventIsRepeating: "Événement récurrent",

  // Success messages
  eventAdded: "Événement ajouté",
  eventUpdated: "Événement mis à jour",
  eventDeleted: "Événement supprimé",
  eventRestored: "Événement restauré",
  eventUpdateUndone: "Modification annulée",

  // Error messages
  failedToAddEvent: "Échec de l'ajout",
  failedToUpdateEvent: "Échec de la mise à jour",
  failedToDeleteEvent: "Échec de la suppression",
  failedToFetchEvents: "Échec du chargement des événements",
  errorCannotExcludeAllDates: "Impossible d'exclure toutes les dates de la plage",

  // Actions
  save: "Enregistrer",
  saving: "Enregistrement",
  cancel: "Annuler",
  delete: "Supprimer",
  deleting: "Suppression",
  undo: "Annuler",
  tryAgain: "Réessayer",
  close: "Fermer",

  // Other UI elements
  search: "Rechercher",
  searchEvents: "Rechercher des événements...",
  noEvents: "Aucun événement",
  allDay: "Toute la journée",
  fullDayEvents: "Événements journée complète",
  loadingEvents: "Chargement des événements...",
  filterByColor: "Filtrer par couleur",
  filter: "Filtrer",
  filtering: "Filtrage",
  more: "plus",

  // Time format
  use24HourFormat: "Format 24 heures",

  // Tooltips
  repeatingEvent: "Événement récurrent",
  multiDayEvent: "Événement sur plusieurs jours",
  extendsOutOfRange: "S'étend au-delà de la vue actuelle",
  displayCalendar: "Afficher le calendrier",
  displayList: "Afficher la liste",

  // Event context
  dayXofY: "Jour {x} sur {y}",
  repeatXofY: "#{x} sur {y}",
  starts: "Début",
  ends: "Fin",
  untitledEvent: "Événement sans titre",

  // Repeating Events
  repeatDaily: "Quotidien",
  repeatWeekly: "Hebdomadaire",
  repeatMonthly: "Mensuel",
  repeatingEventQuestion: "Événement répétitif ?",
  repeatDailyDescription:
    "Se répète quotidiennement à {timeRange} du {startDate} au {endDate}",
  repeatWeeklyDescription:
    "Se répète chaque {dayName} à {timeRange} du {startDate} au {endDate}",
  repeatMonthlyDescription:
    "Se répète le {dayOfMonth} de chaque mois à {timeRange} du {startDate} au {endDate}",
  withExcludedDates: "avec {count} date{s} exclue{s}",
    
  // Repeating event excluded dates
  excludedDates: "Dates exclues?",
  excludedDatesDescription: "Sélectionnez les dates à exclure du modèle récurrent",
  skipDays: "Jours à sauter :",
  clearAll: "Tout effacer",
  selectDatesToExclude: "Sélectionner des dates à exclure",
  selectAll: "Tout sélectionner",
  noMatchingDates: "Aucune date ne correspond à ce modèle de répétition",
  noSearchResults: "Aucun résultat trouvé pour \"{query}\"",
  searchMonthPlaceholder: "Rechercher un mois...",
  ofExcluded: "{count} sur {total} exclues",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Chaque {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "Le {dayOfMonth} de chaque mois ({startDate} - {endDate})",
  dateButtonFormat: "d MMM",

  // Dialog descriptions
  editEventDescription: "Modifiez les détails de votre événement.",
  createEventDescription: "Créez un nouvel événement dans votre calendrier.",

  // Time presets
  timePresetAllDay: "Toute la journée",
  timePresetEarlyMorning: "Tôt le matin",
  timePresetMorning: "Matin",
  timePresetLunch: "Déjeuner",
  timePresetEarlyAfternoon: "Début d'après-midi",
  timePresetLateAfternoon: "Fin d'après-midi",
  timePresetEvening: "Soirée",
  timePresetNight: "Nuit",

  // Additional dialog related strings
  selectDate: "Choisir une date",
  selectColor: "Sélectionner une couleur",
  confirmDelete: "Êtes-vous sûr ?",
  confirmDeleteDescription: "Voulez-vous supprimer cet événement ?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Supprimer un événement récurrent",
  repeatEventDeleteDescription: "Il s'agit d'un événement récurrent. Que souhaitez-vous supprimer ?",
  deleteThisOccurrence: "Supprimer uniquement cette occurrence",
  deleteThisAndFuture: "Supprimer celle-ci et toutes les occurrences futures",
  deleteAllOccurrences: "Supprimer toutes les occurrences",
  deleteThisOccurrenceDescription: "Seule cette date spécifique sera supprimée",
  deleteThisAndFutureDescription: "Cette date et toutes les dates futures seront supprimées",
  deleteAllOccurrencesDescription: "L'événement récurrent entier sera supprimé",
  
  // Recurring event editing
  editRecurringEventTitle: "Modifier un événement récurrent",
  editRecurringEventDescription: "Il s'agit d'un événement récurrent. Souhaitez-vous modifier toutes les occurrences, uniquement celle-ci, ou celle-ci et les occurrences futures ?",
  editThisOccurrence: "Modifier uniquement cette occurrence",
  editThisOccurrenceDescription: "Apporter des modifications uniquement à cette occurrence spécifique",
  editThisAndFuture: "Modifier celle-ci et les occurrences futures",
  editThisAndFutureDescription: "Apporter des modifications à cette occurrence et à toutes les occurrences futures",
  editAllOccurrences: "Modifier toutes les occurrences",
  editAllOccurrencesDescription: "Apporter des modifications à toutes les occurrences de cet événement",
  from: "de",
  to: "à",
  pickADate: "Choisir une date",
  errorEndDateBeforeStart:
    "La date de fin ne peut pas être antérieure à la date de début",
  selectAColor: "Sélectionner une couleur",

  // Form validations
  validations: {
    eventNameRequired: "Le titre de l'événement est requis",
    invalidTimeFormat: "Format d'heure invalide",
    colorRequired: "La couleur est requise",
    endTimeBeforeStart:
      "L'heure de fin ne peut pas être antérieure à l'heure de début",
  },
};
