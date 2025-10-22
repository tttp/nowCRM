import { CalendarEventType } from '../types';

export const filterEventsByColors = (events: CalendarEventType[], selectedColors: string[]) => {
  return events.filter(event => selectedColors.includes(event.color));
};
