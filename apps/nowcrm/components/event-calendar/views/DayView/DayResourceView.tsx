// "use client";

// import { addHours, differenceInDays, endOfDay, format, isSameDay, isWithinInterval, parseISO, startOfDay } from "date-fns";
// import { EVENT_COLOR_OPTIONS } from "../../constants/eventColors";
// import { CalendarEventType, EventCalendarConfigType } from "../../types";
// import { formatHour } from "../../utils/formatHour";
// import { Card } from "@/components/ui/card";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
// import EventSkeleton from "../shared/EventSkeleton";
// import EventListPopup from "../../popups/EventListPopup";
// import { formatEventTime } from "../../utils/formatEventTime";
// import { doesDateMatchRepeatPattern } from "../../utils/doesDateMatchRepeatPattern";
// import { getEventColor } from "../../utils/getEventColor";
// import EventPopup from "../../popups/EventPopup/EventPopup";

// interface DayResourceViewProps {
//     filteredEvents: CalendarEventType[];
//     currentDate: Date;
//     currentConfig: EventCalendarConfigType;
//     is24HourFormat: boolean | undefined;
//     onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
//     onEventUpdate: (event: CalendarEventType) => Promise<void>;
//     onEventDelete: (eventId: string) => Promise<void>;
//     isLoading: boolean;
//     hoverLineRef: React.RefObject<HTMLDivElement>;
//     hoverTimeRef: React.RefObject<HTMLSpanElement>;
//     clickedTime: string | null;
//     setClickedTime: React.Dispatch<React.SetStateAction<string | null>>;
//     currentTimeLineRef: React.RefObject<HTMLDivElement>;
//     currentTimeTop: number;
//     isAddEventPopupOpen: boolean;
//     setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;
// }

// const DayResourceView: React.FC<DayResourceViewProps> = ({
//     filteredEvents,
//     currentDate,
//     currentConfig,
//     is24HourFormat,
//     onEventAdd,
//     onEventUpdate,
//     onEventDelete,
//     isLoading,
//     hoverLineRef,
//     hoverTimeRef,
//     clickedTime,
//     setClickedTime,
//     currentTimeLineRef,
//     currentTimeTop,
//     isAddEventPopupOpen,
//     setIsAddEventPopupOpen,
//     onDateRangeChange
// }) => {
//     const uniqueColors = Array.from(new Set(filteredEvents.map(event => event.color)))
//         .sort((a, b) => {
//             const aIndex = EVENT_COLOR_OPTIONS.findIndex(opt => opt.value === a);
//             const bIndex = EVENT_COLOR_OPTIONS.findIndex(opt => opt.value === b);
//             return aIndex - bIndex;
//         });

//     const todayEvents = filteredEvents.filter(event => {
//         const eventDate = startOfDay(event.startDate);
//         const today = startOfDay(currentDate);

//         if (event.isRepeating) {
//             if (event.isRepeatingExcludedDates && event.isRepeatingExcludedDates.some(excludedDate =>
//                 isSameDay(excludedDate, today))) {
//                 return false;
//             }
            
//             return doesDateMatchRepeatPattern(
//                 today,
//                 event.startDate,
//                 event.endDate || event.startDate,
//                 event.isRepeatingInterval || 'daily'
//             );
//         }

//         if (event.endDate) {
//             // For multi-day events, check if today falls within the range
//             return isWithinInterval(today, { start: eventDate, end: endOfDay(event.endDate) });
//         }

//         // For single-day events, check if it's today
//         return isSameDay(eventDate, today);
//     });

//     const timeHeaders = Array.from({ length: 24 }, (_, i) => ({
//         hour: i,
//         label: formatHour(currentDate, i, is24HourFormat)
//     }));

//     // Separate all-day events from regular events
//     const categorizeEvents = (events: CalendarEventType[]) => {
//         return events.reduce<{
//             allDayEvents: (CalendarEventType & {
//                 isStart?: boolean;
//                 isEnd?: boolean;
//                 isMiddle?: boolean
//             })[];
//             regularEvents: CalendarEventType[];
//         }>(
//             (acc, event) => {
//                 const isAllDay = event.startTime === '00:00' && event.endTime === '23:59';
//                 const isMultiDay = event.endDate && !isSameDay(event.startDate, event.endDate);

//                 if (isAllDay) {
//                     if (isMultiDay) {
//                         if (isSameDay(event.startDate, currentDate)) {
//                             acc.allDayEvents.push({ ...event, isStart: true });
//                         } else if (isSameDay(event.endDate, currentDate)) {
//                             acc.allDayEvents.push({ ...event, isEnd: true });
//                         } else {
//                             acc.allDayEvents.push({ ...event, isMiddle: true });
//                         }
//                     } else {
//                         acc.allDayEvents.push(event);
//                     }
//                 } else {
//                     acc.regularEvents.push(event);
//                 }
//                 return acc;
//             },
//             { allDayEvents: [], regularEvents: [] }
//         );
//     };

//     const getAllDayEventClassName = (event: (CalendarEventType & {
//         isStart?: boolean;
//         isEnd?: boolean;
//         isMiddle?: boolean
//     })) => {
//         if (!event.isRepeating) {
//             return cn(
//                 event.isStart && "border-l-4 border-l-black/70 dark:border-l-white/50",
//                 event.isEnd && "border-r-4 border-r-black/70 dark:border-r-white/50",
//                 event.isMiddle && "border-x-0"
//             );
//         }

//         switch (event.isRepeatingInterval || 'daily') {
//             case 'daily':
//                 return "border border-dashed border-opacity-50";
//             case 'weekly':
//             case 'monthly':
//                 return "border border-dotted border-opacity-50";
//             default:
//                 return "border border-dashed border-opacity-50";
//         }
//     };

//     const getRegularEventClassName = (event: (CalendarEventType & {
//         isStart?: boolean;
//         isEnd?: boolean;
//         isMiddle?: boolean
//     })) => {
//         if (!event.isRepeating) {
//             return cn(
//                 event.isStart && "border-l-4 border-l-black/70 dark:border-l-white/50",
//                 event.isEnd && "border-r-4 border-r-black/70 dark:border-r-white/50",
//                 event.isMiddle && "border-x-0"
//             );
//         }

//         switch (event.isRepeatingInterval || 'daily') {
//             case 'daily':
//                 return "border border-dashed border-opacity-50";
//             case 'weekly':
//             case 'monthly':
//                 return "border border-dotted border-opacity-50";
//             default:
//                 return "border border-dashed border-opacity-50";
//         }
//     };

//     const layoutEventsInColumn = (events: CalendarEventType[]) => {
//         // Sort events: all-day events first, then by start time
//         const processedEvents = events.map(event => {
//             const isAllDay = event.startTime === '00:00' && event.endTime === '23:59';
//             const startMinutes = isAllDay
//                 ? 0
//                 : parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1]);

//             const endMinutes = isAllDay
//                 ? 24 * 60
//                 : parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1]);

//             const isMultiDay = event.endDate && !isSameDay(event.startDate, event.endDate);
//             const isStart = isMultiDay && isSameDay(event.startDate, currentDate);
//             const isEnd = isMultiDay && isSameDay(event.endDate, currentDate);
//             const isMiddle = isMultiDay && !isStart && !isEnd;

//             return {
//                 ...event,
//                 isAllDay,
//                 startMinutes,
//                 endMinutes,
//                 column: 0,
//                 width: 1,
//                 isStart,
//                 isEnd,
//                 isMiddle
//             };
//         }).sort((a, b) => {
//             // Sort all-day events first
//             if (a.isAllDay && !b.isAllDay) return -1;
//             if (!a.isAllDay && b.isAllDay) return 1;
//             // Then sort by start time
//             return a.startMinutes - b.startMinutes;
//         });

//         // Calculate columns for overlapping events
//         const columns: number[] = [];
//         processedEvents.forEach((event) => {
//             let column = 0;
//             while (true) {
//                 const occupied = processedEvents.some(existingEvent =>
//                     existingEvent.column === column &&
//                     event !== existingEvent &&
//                     !(event.startMinutes >= existingEvent.endMinutes ||
//                         event.endMinutes <= existingEvent.startMinutes)
//                 );

//                 if (!occupied) {
//                     event.column = column;
//                     columns[column] = (columns[column] || 0) + 1;
//                     break;
//                 }
//                 column++;
//             }
//         });

//         // Calculate widths based on overlapping events
//         processedEvents.forEach((event) => {
//             let width = 1;
//             let nextColumn = event.column + 1;

//             while (nextColumn < columns.length) {
//                 const hasOverlap = processedEvents.some(otherEvent =>
//                     otherEvent.column === nextColumn &&
//                     !(event.startMinutes >= otherEvent.endMinutes ||
//                         event.endMinutes <= otherEvent.startMinutes)
//                 );

//                 if (hasOverlap) break;
//                 width++;
//                 nextColumn++;
//             }
//             event.width = width;
//         });

//         return {
//             events: processedEvents,
//             totalColumns: Math.max(...columns.map((_, i) => i + 1), 1)
//         };
//     };

//     const handleHourColumnHover = (e: React.MouseEvent<HTMLDivElement>) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const headerHeight = 96; // 48px + 48px for headers
//         const y = e.clientY - rect.top;
//         const hourHeight = 64;

//         // Adjust y position to be relative to the grid
//         const adjustedY = y + headerHeight;

//         let hour, minute, snapY;

//         if (e.ctrlKey) {
//             const totalMinutes = Math.round((y / hourHeight) * 60 / 15) * 15;
//             hour = Math.floor(totalMinutes / 60);
//             minute = totalMinutes % 60;
//             snapY = (totalMinutes / 60) * hourHeight + headerHeight;
//         } else {
//             hour = Math.floor(y / hourHeight);
//             minute = Math.floor((y % hourHeight) / hourHeight * 60);
//             snapY = adjustedY;
//         }

//         hour = Math.max(0, Math.min(23, hour));
//         minute = Math.max(0, Math.min(59, minute));

//         const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

//         if (hoverLineRef.current) {
//             hoverLineRef.current.style.top = `${snapY}px`;
//             hoverLineRef.current.style.display = 'block';
//         }
//         if (hoverTimeRef.current) {
//             hoverTimeRef.current.textContent = time;
//         }
//     };

//     const handleHourColumnLeave = () => {
//         if (hoverLineRef.current) {
//             hoverLineRef.current.style.display = 'none';
//         }
//     };

//     const handleTimeColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const y = e.clientY - rect.top;
//         const hourHeight = 64;

//         const clickedHour = Math.floor(y / hourHeight);
//         const clickedMinute = Math.floor((y % hourHeight) / hourHeight * 60);
//         const time = `${clickedHour.toString().padStart(2, '0')}:${clickedMinute.toString().padStart(2, '0')}`;
//         setClickedTime(time);
//     };

//     const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
//         if (isAddEventPopupOpen) return;
//         if (!currentConfig.dayView!.enableDoubleClickToAddEvent) return;

//         const rect = e.currentTarget.getBoundingClientRect();
//         const y = e.clientY - rect.top;
//         const minutes = Math.floor(y / (16 / 15));
//         const hours = Math.floor(minutes / 60);
//         const mins = minutes % 60;
//         const startTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
//         const endTime = `${(hours + 1).toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

//         const newEvent: Omit<CalendarEventType, 'id'> = {
//             title: '',
//             startDate: currentDate,
//             endDate: currentDate,
//             startTime: startTime,
//             endTime: endTime,
//             color: color, // Use the passed color
//             isRepeating: false,
//         };

//         onEventAdd(newEvent);
//     };

//     return (
//         <Card className="">
//             <ScrollArea className="h-[600px]">
//                 <div className="flex pl-2 pr-2">
//                     {/* Time column */}
//                     <div className="sticky left-0 z-30 w-16 bg-background border-r border-border h-full">
//                         {/* Empty header cell to align with color headers */}
//                         <div className="sticky top-0 z-[200] bg-background h-12 border-b border-border" />
//                         {/* All-day label - made sticky */}
//                         <div className="sticky top-12 z-[200] bg-background h-[3.1rem] flex items-center justify-end pr-4 text-sm text-muted-foreground border-b border-border">
//                             {currentConfig.localization!.allDay}
//                         </div>

//                         {/* Time slots */}
//                         <EventPopup
//                             onAddEvent={onEventAdd}
//                             onDeleteEvent={onEventDelete}
//                             event={{
//                                 startDate: currentDate,
//                                 endDate: currentDate,
//                                 startTime: clickedTime || format(new Date(), 'HH:mm'),
//                                 endTime: clickedTime ?
//                                     format(addHours(parseISO(`2000-01-01T${clickedTime}`), 1), 'HH:mm') :
//                                     format(addHours(new Date(), 1), 'HH:mm'),
//                                 color: uniqueColors?.length ? uniqueColors[0] : undefined
//                             }}
//                             translations={currentConfig.localization!}
//                         >
//                             <div
//                                 onMouseMove={handleHourColumnHover}
//                                 onMouseLeave={handleHourColumnLeave}
//                                 onClick={handleTimeColumnClick}
//                             >
//                                 {timeHeaders.map(({ hour, label }) => (
//                                     <div
//                                         key={hour}
//                                         className="h-16 flex items-center justify-end pr-4 text-sm text-muted-foreground cursor-pointer"
//                                     >
//                                         <span className="mt-[-46px]">{label}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </EventPopup>
//                     </div>

//                     {/* Main content area */}
//                     <div className="flex-1 relative">
//                         {/* Color columns grid */}
//                         <div className="grid pb-4" style={{ gridTemplateColumns: `repeat(${uniqueColors.length}, 1fr)` }}>
//                             {/* Hover line container */}
//                             {!currentConfig.dayView?.hideHoverLine && (
//                                 <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 150 }}>
//                                     <div
//                                         ref={hoverLineRef}
//                                         className="absolute left-0 right-0 h-px bg-primary"
//                                         style={{ display: 'none' }}
//                                     >
//                                         <span
//                                             ref={hoverTimeRef}
//                                             className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-primary text-primary-foreground text-xs px-1 rounded"
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                             {/* current time line */}
//                             {isSameDay(currentDate, new Date()) && !currentConfig.dayView?.hideTimeline && (
//                                 <div
//                                     ref={currentTimeLineRef}
//                                     className="absolute left-0 right-0 h-px bg-red-500 pointer-events-none"
//                                     style={{
//                                         top: `${currentTimeTop}px`,
//                                         zIndex: 30
//                                     }}
//                                 >
//                                     <span className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-red-500 text-white text-xs px-1 rounded">
//                                         {format(new Date(), 'HH:mm')}
//                                     </span>
//                                 </div>
//                             )}

//                             {uniqueColors.map((color) => {
//                                 const colorOption = EVENT_COLOR_OPTIONS.find(opt => opt.value === color);
//                                 const colorEvents = todayEvents.filter(event => event.color === color);
//                                 const { allDayEvents, regularEvents } = categorizeEvents(colorEvents);
//                                 const { events: processedEvents, totalColumns } = layoutEventsInColumn(regularEvents);

//                                 const getEventContext = (event: CalendarEventType, currentDate: Date) => {
//                                     const isFullDay = event.startTime === '00:00' && event.endTime === '23:59';
//                                     if (event.isRepeating && !isFullDay) {
//                                         const startDate = startOfDay(event.startDate);
//                                         const endDate = startOfDay(event.endDate || event.startDate);

//                                         let totalOccurrences: number;
//                                         let currentOccurrence: number;

//                                         switch (event.isRepeatingInterval || 'daily') {
//                                             case 'weekly': {
//                                                 // Count weeks between dates where the day matches
//                                                 const weeksTotal = Math.floor(differenceInDays(endDate, startDate) / 7) + 1;
//                                                 totalOccurrences = weeksTotal;

//                                                 const weeksPassed = Math.floor(differenceInDays(currentDate, startDate) / 7) + 1;
//                                                 currentOccurrence = weeksPassed;
//                                                 break;
//                                             }
//                                             case 'monthly': {
//                                                 // Count months between dates where the day of month matches
//                                                 const monthsTotal = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//                                                     endDate.getMonth() - startDate.getMonth() + 1;
//                                                 totalOccurrences = monthsTotal;

//                                                 const monthsPassed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
//                                                     currentDate.getMonth() - startDate.getMonth() + 1;
//                                                 currentOccurrence = monthsPassed;
//                                                 break;
//                                             }
//                                             case 'daily':
//                                             default: {
//                                                 // For daily repeats, count all days
//                                                 totalOccurrences = differenceInDays(endDate, startDate) + 1;
//                                                 currentOccurrence = differenceInDays(currentDate, startDate) + 1;
//                                                 break;
//                                             }
//                                         }

//                                         return currentConfig.localization!.repeatXofY
//                                             .replace('{x}', currentOccurrence.toString())
//                                             .replace('{y}', totalOccurrences.toString());
//                                     }
//                                 };

//                                 return (
//                                     <div key={color} className="relative border-r border-border flex-1">
//                                         {/* Column header */}
//                                         <div className="sticky top-0 z-50 bg-background h-12 flex items-center justify-center border-b border-border">
//                                             <div className="flex items-center space-x-2">
//                                                 <div className={cn("w-3 h-3 rounded-full flex-shrink-0 hidden sm:block  text-center", colorOption?.class)} />
//                                                 <div className="max-w-[150px] sm:max-w-[200px]">
//                                                     <span className="relative font-medium text-sm sm:text-base group">
//                                                         <span className="block truncate">
//                                                             {colorOption?.label}
//                                                             {colorEvents.length > 0 && ` (${colorEvents.length})`}
//                                                         </span>
//                                                         <span className={cn(
//                                                             "absolute bottom-0 left-0 w-full h-[2px] sm:hidden",
//                                                             colorOption?.class
//                                                         )} />
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* All-day events section */}
//                                         <div className="sticky top-12 z-50 bg-background min-h-[50px] border-b border-border">
//                                             {allDayEvents.length <= 1 ? (
//                                                 allDayEvents.map((event) => (
//                                                     <div className="px-1 py-0.5">
//                                                         <EventPopup
//                                                             key={event.id}
//                                                             event={event}
//                                                             onAddEvent={onEventAdd}
//                                                             onUpdateEvent={onEventUpdate}
//                                                             onDeleteEvent={onEventDelete}
//                                                             dateFromViewClick={currentDate}
//                                                             translations={currentConfig.localization!}
//                                                         >
//                                                             <motion.div
//                                                                 className={cn(
//                                                                     getEventColor(event.color),
//                                                                     "rounded px-2 py-1 mb-0.5 last:mb-0 cursor-pointer",
//                                                                     "hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-colors",
//                                                                     getAllDayEventClassName(event)
//                                                                 )}
//                                                                 initial={{ opacity: 0, y: -10 }}
//                                                                 animate={{ opacity: 1, y: 0 }}
//                                                             >
//                                                                 <div className='max-w-28 md:max-w-48'>
//                                                                     <div className="flex items-center justify-between">
//                                                                         <div className="text-xs font-semibold truncate">
//                                                                             {event.title || currentConfig.localization!.untitledEvent}
//                                                                         </div>
//                                                                         <div className="text-xs font-medium truncate">
//                                                                             {event.isStart
//                                                                                 ? `${currentConfig.localization!.starts}: ${formatEventTime(event.startTime, is24HourFormat)}`
//                                                                                 : event.isEnd
//                                                                                     ? `${currentConfig.localization!.ends}: ${formatEventTime(event.endTime, is24HourFormat)}`
//                                                                                     : null}
//                                                                         </div>
//                                                                     </div>
//                                                                     {event.description && (
//                                                                         <div className="text-xs truncate mt-0.5">{event.description}</div>
//                                                                     )}
//                                                                     {getEventContext(event, currentDate) && (
//                                                                         <div className="text-xs italic">{getEventContext(event, currentDate)}</div>
//                                                                     )}
//                                                                 </div>
//                                                             </motion.div>
//                                                         </EventPopup>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <div className="px-1 py-0.5">
//                                                     <EventListPopup
//                                                         events={allDayEvents}
//                                                         date={currentDate}
//                                                         addEvent={onEventAdd}
//                                                         updateEvent={onEventUpdate}
//                                                         is24HourFormat={is24HourFormat}
//                                                         getEventColor={getEventColor}
//                                                         onDelete={onEventDelete}
//                                                         translations={currentConfig.localization!}
//                                                         preSelectedColor={color}
//                                                     >
//                                                         <motion.div
//                                                             className={cn(
//                                                                 getEventColor(allDayEvents[0].color),
//                                                                 "rounded px-2 py-1 cursor-pointer group",
//                                                                 "hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-colors",
//                                                                 "border border-dashed border-opacity-50"
//                                                             )}
//                                                             initial={{ opacity: 0, y: -10 }}
//                                                             animate={{ opacity: 1, y: 0 }}
//                                                         >
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="text-xs font-medium">
//                                                                     {allDayEvents.length} {currentConfig.localization!.allDay}
//                                                                 </span>
//                                                             </div>
//                                                             <div className="text-xs mt-0.5 truncate max-w-24 sm:max-w-44">
//                                                                 {allDayEvents
//                                                                     .slice(0, 3)
//                                                                     .map(event => event.title || currentConfig.localization!.untitledEvent)
//                                                                     .join(', ')}
//                                                                 {allDayEvents.length > 3 && `, +${allDayEvents.length - 3} more`}
//                                                             </div>
//                                                         </motion.div>
//                                                     </EventListPopup>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Time grid section */}
//                                         <div className="relative" onDoubleClick={(e) => handleDoubleClick(e, color)}>
//                                             {/* Time slots background */}
//                                             {timeHeaders.map(({ hour }) => (
//                                                 <div
//                                                     key={hour}
//                                                     className="h-16 border-b border-border"
//                                                 />
//                                             ))}

//                                             {/* Loading skeletons */}
//                                             {(isLoading && onDateRangeChange) && (
//                                                 Array.from({ length: 10 }).map((_, index) => (
//                                                     <EventSkeleton
//                                                         key={index}
//                                                         className="absolute left-0 right-0 h-[3px] dark:h-[1px] animate-pulse bg-primary/20"
//                                                         style={{
//                                                             top: `${index * 64}px`,
//                                                         }}
//                                                     />
//                                                 ))
//                                             )}

//                                             {/* Regular events */}
//                                             <div className="absolute inset-0">
//                                                 {processedEvents.map((event, eventIndex) => {
//                                                     const left = (event.column * (100 / totalColumns));
//                                                     const width = (event.width * (100 / totalColumns));

//                                                     return (
//                                                         <EventPopup
//                                                             key={event.id}
//                                                             event={event}
//                                                             onAddEvent={onEventAdd}
//                                                             onUpdateEvent={onEventUpdate}
//                                                             onDeleteEvent={onEventDelete}
//                                                             onOpenChange={setIsAddEventPopupOpen}
//                                                             dateFromViewClick={currentDate}
//                                                             translations={currentConfig.localization!}
//                                                         >
//                                                             <motion.div
//                                                                 className={cn(
//                                                                     getEventColor(event.color),
//                                                                     "absolute px-2 py-1 rounded overflow-hidden cursor-pointer",
//                                                                     "transition-colors duration-200",
//                                                                     "hover:bg-opacity-40",
//                                                                     "dark:hover:bg-opacity-40",
//                                                                     getRegularEventClassName(event)
//                                                                 )}
//                                                                 style={{
//                                                                     top: `${event.startMinutes * (16 / 15)}px`,
//                                                                     height: `${Math.max((event.endMinutes - event.startMinutes) * (16 / 15), 24)}px`,
//                                                                     left: `${left}%`,
//                                                                     width: `${width}%`,
//                                                                 }}
//                                                                 initial={{ opacity: 0, x: -20 }}
//                                                                 animate={{ opacity: 1, x: 0 }}
//                                                                 transition={{ delay: eventIndex * 0.1 }}
//                                                             >
//                                                                 <div className="text-xs font-semibold truncate">
//                                                                     {event.title || currentConfig.localization!.untitledEvent}
//                                                                 </div>
//                                                                 <div className="text-xs">
//                                                                     {event.isStart
//                                                                         ? `${currentConfig.localization!.starts}: ${formatEventTime(event.startTime, is24HourFormat)}`
//                                                                         : event.isEnd
//                                                                             ? `${currentConfig.localization!.ends}: ${formatEventTime(event.endTime, is24HourFormat)}`
//                                                                             : `${formatEventTime(event.startTime, is24HourFormat)} - ${formatEventTime(event.endTime, is24HourFormat)}`}
//                                                                 </div>
//                                                                 {event.description && (
//                                                                     <div className="text-xs truncate mt-0.5">
//                                                                         {event.description}
//                                                                     </div>
//                                                                 )}
//                                                                 {(event.isRepeating || event.isStart || event.isEnd || event.isMiddle) && (
//                                                                     <div className="text-xs italic">
//                                                                         {getEventContext(event, currentDate)}
//                                                                     </div>
//                                                                 )}
//                                                             </motion.div>
//                                                         </EventPopup>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>
//                 <ScrollBar orientation="horizontal" />
//             </ScrollArea>
//         </Card>
//     );
// };

// export default DayResourceView;
