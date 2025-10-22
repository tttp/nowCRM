import { EventCalendarTranslations } from "../types/EventCalendarTranslations";

export const ptBR: EventCalendarTranslations = {
  // Locale information
  language: "pt",
  
  // Time and date
  today: "Hoje",
  thisWeek: "Esta Semana",
  thisMonth: "Este Mês",
  thisYear: "Este Ano",
  dayNames: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  fullDayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],

  // Views
  viewBy: "Visualizar por",
  day: "Dia",
  week: "Semana",
  month: "Mês",
  year: "Ano",
  list: "Lista",

  // Event actions
  addEvent: "+ Evento",
  editEvent: "Editar Evento",
  deleteEvent: "Excluir Evento",
  eventTitle: "Título do Evento",
  eventDescription: "Descrição",
  eventColor: "Cor do Evento",
  eventDate: "Data",
  eventStartTime: "Hora de Início",
  eventEndTime: "Hora de Término",
  eventEndDate: "Data de Término",
  eventIsRepeating: "Evento Recorrente",

  // Success messages
  eventAdded: "Evento adicionado",
  eventUpdated: "Evento atualizado",
  eventDeleted: "Evento excluído",
  eventRestored: "Evento restaurado",
  eventUpdateUndone: "Atualização do evento desfeita",

  // Error messages
  failedToAddEvent: "Falha ao adicionar evento",
  failedToUpdateEvent: "Falha ao atualizar evento",
  failedToDeleteEvent: "Falha ao excluir evento",
  failedToFetchEvents: "Falha ao carregar eventos",
  errorCannotExcludeAllDates: "Não é possível excluir todas as datas no intervalo",

  // Actions
  save: "Salvar",
  saving: "Salvando",
  cancel: "Cancelar",
  delete: "Excluir",
  deleting: "Excluindo",
  undo: "Desfazer",
  tryAgain: "Tentar novamente",
  close: "Fechar",

  // Other UI elements
  search: "Buscar",
  searchEvents: "Buscar eventos...",
  noEvents: "Sem eventos",
  allDay: "Dia Inteiro",
  fullDayEvents: "Eventos de Dia Inteiro",
  loadingEvents: "Carregando eventos...",
  filterByColor: "Filtrar por Cor",
  filter: "Filtrar",
  filtering: "Filtrando",
  more: "mais",

  // Time format
  use24HourFormat: "Usar formato 24 horas",

  // Tooltips
  repeatingEvent: "Evento recorrente",
  multiDayEvent: "Evento de vários dias",
  extendsOutOfRange: "Estende-se além da visualização atual",
  displayCalendar: "Exibir Calendário",
  displayList: "Exibir Lista",

  // Event context
  dayXofY: "Dia {x} de {y}",
  repeatXofY: "#{x} de {y}",
  starts: "Início",
  ends: "Término",
  untitledEvent: "Evento sem título",

  repeatDaily: "Diariamente",
  repeatWeekly: "Semanalmente",
  repeatMonthly: "Mensalmente",
  repeatingEventQuestion: "Evento recorrente?",
  repeatDailyDescription:
    "Repete diariamente às {timeRange} de {startDate} até {endDate}",
  repeatWeeklyDescription:
    "Repete toda(o) {dayName} às {timeRange} de {startDate} até {endDate}",
  repeatMonthlyDescription:
    "Repete todo dia {dayOfMonth} do mês às {timeRange} de {startDate} até {endDate}",
  withExcludedDates: "com {count} data{s} excluída{s}",
    
  // Repeating event excluded dates
  excludedDates: "Datas excluídas?",
  excludedDatesDescription: "Selecione datas para excluir do padrão recorrente",
  skipDays: "Pular Dias:",
  clearAll: "Limpar tudo",
  selectDatesToExclude: "Selecionar datas para excluir",
  selectAll: "Selecionar Tudo",
  noMatchingDates: "Nenhuma data corresponde a este padrão de repetição",
  noSearchResults: "Nenhum resultado encontrado para \"{query}\"",
  searchMonthPlaceholder: "Pesquisar mês...",
  ofExcluded: "{count} de {total} excluídas",
  pageCount: "{current}/{total}",
  weeklyIntervalLabel: "Toda(o) {dayName} ({startDate} - {endDate})",
  monthlyIntervalLabel: "Dia {dayOfMonth} de cada mês ({startDate} - {endDate})",
  dateButtonFormat: "d MMM",

  // Dialog descriptions
  editEventDescription: "Edite os detalhes do seu evento.",
  createEventDescription: "Crie um novo evento no seu calendário.",

  // Time presets
  timePresetAllDay: "Dia Inteiro",
  timePresetEarlyMorning: "Início da Manhã",
  timePresetMorning: "Manhã",
  timePresetLunch: "Almoço",
  timePresetEarlyAfternoon: "Início da Tarde",
  timePresetLateAfternoon: "Fim da Tarde",
  timePresetEvening: "Noite",
  timePresetNight: "Madrugada",

  // Additional dialog related strings
  selectDate: "Escolha uma data",
  selectColor: "Selecione uma cor",
  confirmDelete: "Tem certeza?",
  confirmDeleteDescription: "Deseja excluir este evento?",
  // Repeating event deletion
  repeatEventDeleteTitle: "Excluir Evento Recorrente",
  repeatEventDeleteDescription: "Este é um evento recorrente. O que você deseja excluir?",
  deleteThisOccurrence: "Excluir apenas esta ocorrência",
  deleteThisAndFuture: "Excluir esta e todas as ocorrências futuras",
  deleteAllOccurrences: "Excluir todas as ocorrências",
  deleteThisOccurrenceDescription: "Apenas esta data específica será removida",
  deleteThisAndFutureDescription: "Esta e todas as datas futuras serão removidas",
  deleteAllOccurrencesDescription: "Todo o evento recorrente será removido",
  
  // Recurring event editing
  editRecurringEventTitle: "Editar Evento Recorrente",
  editRecurringEventDescription: "Este é um evento recorrente. Deseja editar todas as ocorrências, apenas esta, ou esta e as ocorrências futuras?",
  editThisOccurrence: "Editar apenas esta ocorrência",
  editThisOccurrenceDescription: "Fazer alterações apenas nesta ocorrência específica do evento",
  editThisAndFuture: "Editar esta e as ocorrências futuras",
  editThisAndFutureDescription: "Fazer alterações nesta e em todas as ocorrências futuras",
  editAllOccurrences: "Editar todas as ocorrências",
  editAllOccurrencesDescription: "Fazer alterações em todas as ocorrências deste evento",
  from: "de",
  to: "até",
  pickADate: "Escolha uma data",
  errorEndDateBeforeStart:
    "A data de término não pode ser anterior à data de início",
  selectAColor: "Selecione uma cor",

  // Form validations
  validations: {
    eventNameRequired: "Nome do evento é obrigatório",
    invalidTimeFormat: "Formato de hora inválido",
    colorRequired: "Cor é obrigatória",
    endTimeBeforeStart:
      "O horário de término não pode ser anterior ao horário de início",
  },
};
