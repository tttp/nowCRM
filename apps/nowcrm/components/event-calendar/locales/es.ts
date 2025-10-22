import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const es: EventCalendarTranslations = {
  // Locale information
  language: "es",
  
  // Time and date
  today: "Hoy",
  thisWeek: "Esta Semana",
  thisMonth: "Este Mes",
  thisYear: "Este Año",
  dayNames: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  fullDayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],

  // Views
  viewBy: "Ver por",
  day: "Día",
  week: "Semana",
  month: "Mes",
  year: "Año",
  list: "Lista",

  // Event actions
  addEvent: "+ Evento",
  editEvent: "Editar Evento",
  deleteEvent: "Eliminar Evento",
  eventTitle: "Título del Evento",
  eventDescription: "Descripción",
  eventColor: "Color del Evento",
  eventDate: "Fecha",
  eventStartTime: "Hora de Inicio",
  eventEndTime: "Hora de Fin",
  eventEndDate: "Fecha de Fin",
  eventIsRepeating: "Evento Recurrente",

  // Success messages
  eventAdded: "Evento agregado",
  eventUpdated: "Evento actualizado",
  eventDeleted: "Evento eliminado",
  eventRestored: "Evento restaurado",
  eventUpdateUndone: "Cambios en el evento deshechos",

  // Error messages
  failedToAddEvent: "Error al agregar el evento",
  failedToUpdateEvent: "Error al actualizar el evento",
  failedToDeleteEvent: "Error al eliminar el evento",
  failedToFetchEvents: "Error al cargar los eventos",
  errorCannotExcludeAllDates: "No se pueden excluir todas las fechas en el rango",

  // Actions
  save: "Guardar",
  saving: "Guardando",
  cancel: "Cancelar",
  delete: "Eliminar",
  deleting: "Eliminando",
  undo: "Deshacer",
  tryAgain: "Intentar de nuevo",
  close: "Cerrar",

  // Other UI elements
  search: "Buscar",
  searchEvents: "Buscar eventos...",
  noEvents: "No hay eventos",
  allDay: "Todo el día",
  fullDayEvents: "Eventos de todo el día",
  loadingEvents: "Cargando eventos...",
  filterByColor: "Filtrar por color",
  filter: "Filtrar",
  filtering: "Filtrando",
  more: "más",

  // Time format
  use24HourFormat: "Usar formato 24 horas",

  // Tooltips
  repeatingEvent: "Evento recurrente",
  multiDayEvent: "Evento de varios días",
  extendsOutOfRange: "Se extiende más allá de la vista actual",
  displayCalendar: "Mostrar Calendario",
  displayList: "Mostrar Lista",

  // Event context
  dayXofY: "Día {x} de {y}",
  repeatXofY: "#{x} de {y}",
  starts: "Comienza",
  ends: "Termina",
  untitledEvent: "Evento sin título",

  // Repeating Events
  repeatDaily: "Diariamente",
  repeatWeekly: "Semanalmente",
  repeatMonthly: "Mensualmente",
  repeatingEventQuestion: "¿Evento repetitivo?",
  repeatDailyDescription:
    "Se repite diariamente a las {timeRange} desde el {startDate} hasta el {endDate}",
  repeatWeeklyDescription:
    "Se repite cada {dayName} a las {timeRange} desde el {startDate} hasta el {endDate}",
  repeatMonthlyDescription:
    "Se repite el {dayOfMonth} de cada mes a las {timeRange} desde el {startDate} hasta el {endDate}",
  withExcludedDates: "con {count} fecha{s} excluida{s}",
    
  // Repeating event excluded dates
  excludedDates: "Fechas excluidas?",
  excludedDatesDescription: "Seleccione fechas para excluir del patrón recurrente",
  skipDays: "Omitir días:",
  clearAll: "Borrar todo",
  selectDatesToExclude: "Seleccionar fechas para excluir",
  selectAll: "Seleccionar Todo",
  noMatchingDates: "Ninguna fecha coincide con este patrón de repetición",
  noSearchResults: "No se encontraron resultados para \"{query}\"",
  searchMonthPlaceholder: "Buscar mes...",
  ofExcluded: "{count} de {total} excluidas",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Cada {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "El {dayOfMonth} de cada mes ({startDate} - {endDate})",
  dateButtonFormat: "d MMM",

  // Dialog descriptions
  editEventDescription: "Edita los detalles de tu evento.",
  createEventDescription: "Crea un nuevo evento en tu calendario.",

  // Time presets
  timePresetAllDay: "Todo el día",
  timePresetEarlyMorning: "Temprano en la mañana",
  timePresetMorning: "Mañana",
  timePresetLunch: "Almuerzo",
  timePresetEarlyAfternoon: "Temprano en la tarde",
  timePresetLateAfternoon: "Final de la tarde",
  timePresetEvening: "Noche",
  timePresetNight: "Madrugada",

  // Additional dialog related strings
  selectDate: "Seleccionar fecha",
  selectColor: "Seleccionar color",
  confirmDelete: "¿Estás seguro?",
  confirmDeleteDescription: "¿Deseas eliminar este evento?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Eliminar Evento Recurrente",
  repeatEventDeleteDescription: "Este es un evento recurrente. ¿Qué deseas eliminar?",
  deleteThisOccurrence: "Eliminar solo esta ocurrencia",
  deleteThisAndFuture: "Eliminar esta y todas las ocurrencias futuras",
  deleteAllOccurrences: "Eliminar todas las ocurrencias",
  deleteThisOccurrenceDescription: "Solo se eliminará esta fecha específica",
  deleteThisAndFutureDescription: "Se eliminarán esta y todas las fechas futuras",
  deleteAllOccurrencesDescription: "Se eliminará todo el evento recurrente",
  
  // Recurring event editing
  editRecurringEventTitle: "Editar Evento Recurrente",
  editRecurringEventDescription: "Este es un evento recurrente. ¿Te gustaría editar todas las ocurrencias, solo esta, o esta y las futuras ocurrencias?",
  editThisOccurrence: "Editar solo esta ocurrencia",
  editThisOccurrenceDescription: "Hacer cambios solo a esta ocurrencia específica del evento",
  editThisAndFuture: "Editar esta y las ocurrencias futuras",
  editThisAndFutureDescription: "Hacer cambios a esta y todas las ocurrencias futuras",
  editAllOccurrences: "Editar todas las ocurrencias",
  editAllOccurrencesDescription: "Hacer cambios a todas las ocurrencias de este evento",
  from: "desde",
  to: "hasta",
  pickADate: "Seleccionar fecha",
  errorEndDateBeforeStart:
    "La fecha de fin no puede ser anterior a la fecha de inicio",
  selectAColor: "Seleccionar color",

  // Form validations
  validations: {
    eventNameRequired: "El título del evento es obligatorio",
    invalidTimeFormat: "Formato de hora inválido",
    colorRequired: "El color es obligatorio",
    endTimeBeforeStart:
      "La hora de fin no puede ser anterior a la hora de inicio",
  },
};
