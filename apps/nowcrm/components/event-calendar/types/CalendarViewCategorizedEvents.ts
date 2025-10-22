import { CalendarEventType } from ".";

export interface CalendarViewCategorizedEvents {
    repeatingFullDayEvents: CalendarEventType[];
    multiDayEvents: (CalendarEventType & { isStart?: boolean; isEnd?: boolean; isMiddle?: boolean })[];
    fullDayEvents: CalendarEventType[];
    regularEvents: CalendarEventType[];
}
