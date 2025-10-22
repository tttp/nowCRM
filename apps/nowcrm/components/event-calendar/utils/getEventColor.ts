import { EVENT_COLOR_OPTIONS } from "../constants/eventColors";

export const getEventColor = (color: string) => {
  const colorOption = EVENT_COLOR_OPTIONS.find(
    (option) => option.value === color
  );
  return colorOption ? colorOption.class : EVENT_COLOR_OPTIONS[0].class;
};
