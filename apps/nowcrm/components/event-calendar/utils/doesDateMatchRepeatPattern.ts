import { getDay, isWithinInterval } from "date-fns";

export const doesDateMatchRepeatPattern = (
    date: Date,
    startDate: Date,
    endDate: Date,
    repeatInterval: 'daily' | 'weekly' | 'monthly' | undefined
): boolean => {
    if (!repeatInterval) return false;

    const isWithinRange = isWithinInterval(date, { start: startDate, end: endDate });
    if (!isWithinRange) return false;

    switch (repeatInterval) {
        case 'daily':
            return true;
        case 'weekly':
            return getDay(date) === getDay(startDate);
        case 'monthly':
            return date.getDate() === startDate.getDate();
        default:
            return false;
    }
};
