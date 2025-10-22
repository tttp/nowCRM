// "use client";

// /**
//  * DayView Component
//  * 
//  * A component that manages the display of calendar events for a single day,
//  * supporting both regular and resource-based view types.
//  * 
//  * Core Features:
//  * 1. View Type Management
//  *    - Regular day view with hourly divisions
//  *    - Resource-based view for multiple resources per event color
//  * 
//  * 2. Event Visualization
//  *    - Event rendering and management
//  *    - Time indicators and hover effects
//  *    - Current time tracking
//  * 
//  * Usage:
//  * ```tsx
//  * <DayView
//  *   filteredEvents={events}
//  *   currentDate={new Date()}
//  *   currentConfig={config}
//  *   onEventUpdate={handleUpdate}
//  *   // ... other props
//  * />
//  * ```
//  * 
//  * Props Interface Grouping:
//  * 1. Basic Props:
//  *    - filteredEvents: Events to display
//  *    - currentDate: Selected date
//  *    - currentConfig: Calendar configuration
//  *    - isLoading: Loading state
//  * 
//  * 2. Time Management:
//  *    - is24HourFormat: Time format toggle
//  *    - clickedTime: Selected time
//  *    - currentTimeTop: Current time position
//  * 
//  * 3. Event Handlers:
//  *    - onEventAdd: New event creation
//  *    - onEventUpdate: Event updates
//  *    - onEventDelete: Event deletion
//  * 
//  * 4. UI References:
//  *    - hoverLineRef: Hover effect line
//  *    - hoverTimeRef: Hover time display
//  *    - currentTimeLineRef: Current time indicator
//  * 
//  * 5. State Management:
//  *    - setClickedTime: Time selection
//  *    - setIsAddEventPopupOpen: Add event popup
//  */

// import { EventCalendarConfigType, CalendarEventType } from "../../types";
// import DayRegularView from "./DayRegularView";
// // import DayResourceView from "./DayResourceView";

// interface DayViewProps {
//     // Basic Props
//     filteredEvents: CalendarEventType[];
//     currentDate: Date;
//     currentConfig: EventCalendarConfigType;
//     isLoading: boolean;

//     // Time Management
//     is24HourFormat?: boolean;
//     clickedTime: string | null;
//     currentTimeTop: number;

//     // Event Handlers
//     onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
//     onEventUpdate: (event: CalendarEventType) => Promise<void>;
//     onEventDelete: (eventId: string) => Promise<void>;
//     onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;

//     // UI References
//     hoverLineRef: React.RefObject<HTMLDivElement>;
//     hoverTimeRef: React.RefObject<HTMLSpanElement>;
//     currentTimeLineRef: React.RefObject<HTMLDivElement>;

//     // State Management
//     isAddEventPopupOpen: boolean;
//     setClickedTime: React.Dispatch<React.SetStateAction<string | null>>;
//     setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const DayView: React.FC<DayViewProps> = ({
//     // Basic Props
//     filteredEvents,
//     currentDate,
//     currentConfig,
//     isLoading,

//     // Time Management
//     is24HourFormat,
//     clickedTime,
//     currentTimeTop,
//     hoverLineRef,
//     hoverTimeRef,
//     currentTimeLineRef,
//     setClickedTime,

//     // Event Handlers
//     onEventAdd,
//     onEventUpdate,
//     onEventDelete,
//     onDateRangeChange,

//     // Double Click Management
//     isAddEventPopupOpen,
//     setIsAddEventPopupOpen,
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
//         hoverLineRef,
//         hoverTimeRef,
//         clickedTime,
//         setClickedTime,
//         currentTimeLineRef,
//         currentTimeTop,
//         isLoading,
//         isAddEventPopupOpen,
//         setIsAddEventPopupOpen,
//         onDateRangeChange
//     };

//     return (
//         <>
//             {currentConfig.dayView?.viewType === 'resource' ? (
//                 <DayResourceView {...commonViewProps} />
//             ) : (
//                 <DayRegularView {...commonViewProps} />
//             )}
//         </>
//     );
// };

// export default DayView;
