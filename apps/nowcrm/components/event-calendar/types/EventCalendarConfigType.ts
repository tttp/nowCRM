import { CalendarViewType } from "./CalendarViewType";
import { EventCalendarTranslations } from "./EventCalendarTranslations";

export type EventCalendarConfigType = {
  defaultView?: CalendarViewType;
  use24HourFormatByDefault?: boolean;
  dayView?: {
    viewType?: "regular" | "resource";
    hideHoverLine?: boolean;
    hideTimeline?: boolean;
    enableDoubleClickToAddEvent?: boolean;
  };
  weekView?: {
    viewType?: "regular" | "resource";
    hideHoverLine?: boolean;
    hideTimeline?: boolean;
    enableDoubleClickToShiftViewToDaily?: boolean;
    resourceDisplayMode?: "row" | "column";
  };
  monthView?: {
    showOnlyCurrentMonth?: boolean;
    viewType?: "basic" | "detailed";
    enableDoubleClickToShiftViewToWeekly?: boolean;
  };
  yearView?: {
    enableDoubleClickToShiftViewToMonthly?: boolean;
  };
  localization?: EventCalendarTranslations;
};
