import { setHours, setMinutes, format } from "date-fns";

export const formatEventTime = (time: string, is24HourFormat?: boolean) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = setHours(setMinutes(new Date(), minutes), hours);
  if (is24HourFormat) {
    return format(date, "HH:mm");
  } else {
    return format(date, "h:mm").toLowerCase() + format(date, "a").toLowerCase();
  }
};
