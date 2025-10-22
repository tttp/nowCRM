import { enUS } from "../locales/en"
import type { EventCalendarConfigType } from "../types"

export const defaultConfig: EventCalendarConfigType = {
  defaultView: "month",
  use24HourFormatByDefault: true,
  dayView: {
    enableDoubleClickToAddEvent: false,
    viewType: "regular",
  },
  weekView: {
    enableDoubleClickToShiftViewToDaily: false,
    viewType: "regular",
  },
  monthView: {
    enableDoubleClickToShiftViewToWeekly: false,
    viewType: "basic",
  },
  yearView: {
    enableDoubleClickToShiftViewToMonthly: false,
  },
  localization: enUS,
}
