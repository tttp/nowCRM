import { format, setHours } from "date-fns";

export const formatHour = (currentDate: Date, hour: number, is24HourFormat?: boolean) => {
    if (is24HourFormat) {
        return format(setHours(currentDate, hour), 'HH:mm');
    }
    return format(setHours(currentDate, hour), 'h a').toLowerCase();
};
