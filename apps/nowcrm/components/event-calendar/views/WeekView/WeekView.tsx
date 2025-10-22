// "use client";

// import { CalendarEventType, EventCalendarConfigType, CalendarViewType } from "../../types";
// import WeekRegularView from "./WeekRegularView";
// import WeekResourceView from "./WeekResourceView";

// interface WeekViewProps {
//     filteredEvents: CalendarEventType[];
//     currentDate: Date;
//     is24HourFormat: boolean | undefined;
//     hoverLineRef: React.RefObject<HTMLDivElement>;
//     hoverTimeRef: React.RefObject<HTMLSpanElement>;
//     setClickedTime: React.Dispatch<React.SetStateAction<string | null>>;
//     clickedTime: string | null;
//     isAddEventPopupOpen: boolean;
//     currentConfig: EventCalendarConfigType;
//     setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
//     setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
//     onEventUpdate: (event: CalendarEventType) => Promise<void>;
//     onEventDelete: (eventId: string) => Promise<void>;
//     onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
//     setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     isLoading: boolean;
//     currentTimeLineRef: React.RefObject<HTMLDivElement>;
//     currentTimeTop: number;
//     onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;
// }

// const WeekView: React.FC<WeekViewProps> = ({
//     filteredEvents,
//     currentDate,
//     is24HourFormat,
//     hoverLineRef,
//     hoverTimeRef,
//     setClickedTime,
//     clickedTime,
//     isAddEventPopupOpen,
//     currentConfig,
//     setCurrentDate,
//     setCurrentView,
//     onEventUpdate,
//     onEventDelete,
//     onEventAdd,
//     setIsAddEventPopupOpen,
//     isLoading,
//     currentTimeLineRef,
//     currentTimeTop,
//     onDateRangeChange,
// }) => {
//     // Common props shared between both view types
//     const commonViewProps = {
//         filteredEvents,
//         currentDate,
//         currentConfig,
//         is24HourFormat,
//         onEventAdd,
//         onEventUpdate,
//         onEventDelete,
//         isLoading,
//         isAddEventPopupOpen,
//         setIsAddEventPopupOpen,
//         setCurrentDate,
//         setCurrentView,
//         onDateRangeChange
//     };

//     return (
//         <>
//             {currentConfig.weekView?.viewType === 'resource' ? (
//                 <WeekResourceView {...commonViewProps} />
//             ) : (
//                 <WeekRegularView
//                     {...commonViewProps}
//                     hoverLineRef={hoverLineRef}
//                     hoverTimeRef={hoverTimeRef}
//                     setClickedTime={setClickedTime}
//                     clickedTime={clickedTime}
//                     currentTimeLineRef={currentTimeLineRef}
//                     currentTimeTop={currentTimeTop}
//                 />
//             )}
//         </>
//     );
// };

// export default WeekView;
