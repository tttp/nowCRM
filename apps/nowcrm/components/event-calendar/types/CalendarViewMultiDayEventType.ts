import { CalendarEventType } from ".";

export type CalendarViewMultiDayEventType = CalendarEventType & {
    isStart?: boolean;
    isEnd?: boolean;
    isMiddle?: boolean;
  };
