// "use client";

// import { Card } from "@/components/ui/card";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";
// import { eachDayOfInterval, endOfDay, endOfWeek, format, getWeek, isSameDay, isWithinInterval, startOfDay, startOfWeek } from "date-fns";
// import { motion } from "framer-motion";
// import { CalendarEventType, CalendarViewType, EventCalendarConfigType } from "../../types";
// import { doesDateMatchRepeatPattern } from "../../utils/doesDateMatchRepeatPattern";
// import { EVENT_COLOR_OPTIONS } from "../../constants/eventColors";
// import { getEventColor } from "../../utils/getEventColor";
// import { formatEventTime } from "../../utils/formatEventTime";
// import EventSkeleton from "../shared/EventSkeleton";
// import EventPopup from "../../popups/EventPopup/EventPopup";
// import EventListPopup from "../../popups/EventListPopup";
// import { Button } from "@/components/ui/button";

// interface WeekResourceViewProps {
//     filteredEvents: CalendarEventType[];
//     currentDate: Date;
//     currentConfig: EventCalendarConfigType;
//     is24HourFormat: boolean | undefined;
//     onEventAdd: (event: Omit<CalendarEventType, 'id'>) => Promise<void>;
//     onEventUpdate: (event: CalendarEventType) => Promise<void>;
//     onEventDelete: (eventId: string) => Promise<void>;
//     isLoading: boolean;
//     setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
//     setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>;
//     isAddEventPopupOpen: boolean;
//     setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>;
// }

// const WeekResourceView: React.FC<WeekResourceViewProps> = ({
//     filteredEvents,
//     currentDate,
//     currentConfig,
//     is24HourFormat,
//     onEventAdd,
//     onEventUpdate,
//     onEventDelete,
//     isLoading,
//     setCurrentDate,
//     setCurrentView,
//     isAddEventPopupOpen,
//     setIsAddEventPopupOpen,
//     onDateRangeChange
// }) => {
//     const weekStart = startOfWeek(currentDate, { weekStartsOn: is24HourFormat ? 1 : 0 });
//     const weekEnd = endOfWeek(currentDate, { weekStartsOn: is24HourFormat ? 1 : 0 });
//     const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
//     const weekNumber = getWeek(weekStart, { weekStartsOn: is24HourFormat ? 1 : 0 });

//     // Get unique colors from events and sort them based on EVENT_COLOR_OPTIONS order
//     const uniqueColors = Array.from(new Set(filteredEvents.map(event => event.color)))
//         .sort((a, b) => {
//             const aIndex = EVENT_COLOR_OPTIONS.findIndex(opt => opt.value === a);
//             const bIndex = EVENT_COLOR_OPTIONS.findIndex(opt => opt.value === b);
//             return aIndex - bIndex;
//         });

//     const isEventInDay = (event: CalendarEventType, day: Date) => {
//         if (event.isRepeating) {
//             if (event.isRepeatingExcludedDates && event.isRepeatingExcludedDates.some(excludedDate =>
//                 isSameDay(excludedDate, day))) {
//                 return false;
//             }

//             return doesDateMatchRepeatPattern(
//                 day,
//                 event.startDate,
//                 event.endDate || event.startDate,
//                 event.isRepeatingInterval || 'daily'
//             );
//         }

//         if (event.endDate) {
//             return isWithinInterval(day, {
//                 start: startOfDay(event.startDate),
//                 end: endOfDay(event.endDate)
//             });
//         }
//         return isSameDay(event.startDate, day);
//     };

//     const getEventPosition = (event: CalendarEventType, day: Date): 'start' | 'middle' | 'end' | 'single' => {
//         if (event.isRepeating) {
//             // For weekly and monthly repeating events, treat each occurrence as a single event
//             if (event.isRepeatingInterval === 'weekly' || event.isRepeatingInterval === 'monthly') {
//                 return 'single';
//             }

//             // For daily repeating events, maintain the continuous visual
//             const isStart = isSameDay(event.startDate, day);
//             const isEnd = event.endDate && isSameDay(event.endDate, day);

//             if (isStart && isEnd) return 'single';
//             if (isStart) return 'start';
//             if (isEnd) return 'end';
//             return 'middle';
//         }

//         // Non-repeating events
//         const isStart = isSameDay(event.startDate, day);
//         const isEnd = event.endDate && isSameDay(event.endDate, day);

//         if (event.endDate) {
//             if (isStart && isEnd) return 'single';
//             if (isStart) return 'start';
//             if (isEnd) return 'end';
//             return 'middle';
//         }
//         return 'single';
//     };

//     const getBorderStyle = (event: CalendarEventType, position: 'start' | 'middle' | 'end' | 'single') => {
//         if (!event.isRepeating) {
//             return cn(
//                 position === 'start' && "border-l-4 border-l-black/70 dark:border-l-white/50",
//                 position === 'end' && "border-r-4 border-r-black/70 dark:border-r-white/50",
//                 position === 'middle' && "border-x-0"
//             );
//         }

//         switch (event.isRepeatingInterval || 'daily') {
//             case 'daily':
//                 return cn(
//                     "border border-dashed border-opacity-50",
//                     position === 'start' && "border-l-solid border-l-2 border-l-black/70 dark:border-l-white/50",
//                     position === 'end' && "border-r-solid border-r-2 border-r-black/70 dark:border-r-white/50",
//                     position === 'middle' && "border-x-0"
//                 );
//             case 'weekly':
//             case 'monthly':
//                 return "border border-dotted border-opacity-50";
//             default:
//                 return "";
//         }
//     };

//     const handleDayDoubleClick = (day: Date) => {
//         if (isAddEventPopupOpen) return;
//         if (currentConfig.weekView!.enableDoubleClickToShiftViewToDaily) {
//             setCurrentDate(day);
//             setCurrentView('day');
//         }
//     };

//     // Determine display mode, defaulting to "row"
//     const resourceDisplayMode = currentConfig.weekView?.resourceDisplayMode || "row";

//     // Event cell inline-component
//     const renderEventCell = (event: CalendarEventType, day: Date, eventIndex: number) => {
//         const position = getEventPosition(event, day);
//         const borderStyle = getBorderStyle(event, position);

//         const shouldShowTime = event.isRepeating ||
//             position === 'single' ||
//             (position === 'start' && !event.isRepeating) ||
//             (position === 'end' && !event.isRepeating);

//         return (
//             <EventPopup
//                 key={event.id}
//                 event={event}
//                 onAddEvent={onEventAdd}
//                 onUpdateEvent={onEventUpdate}
//                 onDeleteEvent={onEventDelete}
//                 onOpenChange={setIsAddEventPopupOpen}
//                 dateFromViewClick={day}
//                 translations={currentConfig.localization!}
//             >
//                 <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: eventIndex * 0.1 }}
//                     className={cn(
//                         getEventColor(event.color),
//                         "mb-1 last:mb-0 px-2 py-1 rounded cursor-pointer",
//                         "transition-colors duration-200",
//                         "hover:bg-opacity-50 dark:hover:bg-opacity-60",
//                         "flex items-center justify-between gap-1",
//                         borderStyle
//                     )}
//                 >
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-xs">
//                         {event.title || currentConfig.localization!.untitledEvent}
//                     </span>
//                     {shouldShowTime && (
//                         <span className="text-[10px] opacity-75 whitespace-nowrap">
//                             {event.isRepeating || position !== 'end'
//                                 ? formatEventTime(event.startTime, is24HourFormat)
//                                 : `ends ${formatEventTime(event.endTime, is24HourFormat)}`}
//                         </span>
//                     )}
//                 </motion.div>
//             </EventPopup>
//         );
//     };

//     // Render add event button or "more" button
//     const renderAddOrMoreButton = (dayEvents: CalendarEventType[], day: Date, color: string) => {
//         if (dayEvents.length <= 3) {
//             return (
//                 <EventPopup
//                     event={{ startDate: day, endDate: day, color }}
//                     onAddEvent={(newEvent) => onEventAdd({ ...newEvent })}
//                     onOpenChange={setIsAddEventPopupOpen}
//                     translations={currentConfig.localization!}
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="group"
//                     >
//                         {/* Mobile View (always visible) */}
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="w-full h-6 text-xs text-muted-foreground hover:text-foreground truncate px-2 md:hidden"
//                         >
//                             +
//                         </Button>

//                         {/* Desktop View (visible on hover) */}
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="w-full h-6 text-xs text-muted-foreground hover:text-foreground truncate px-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                         >
//                             + {currentConfig.localization!.addEvent}
//                         </Button>
//                     </motion.div>
//                 </EventPopup>
//             );
//         } else {
//             return (
//                 <EventListPopup
//                     events={dayEvents}
//                     addEvent={onEventAdd}
//                     updateEvent={onEventUpdate}
//                     onDelete={onEventDelete}
//                     date={day}
//                     is24HourFormat={is24HourFormat}
//                     getEventColor={getEventColor}
//                     preSelectedColor={color}
//                     translations={currentConfig.localization!}
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                     >
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="w-full h-6 text-xs text-muted-foreground hover:text-foreground truncate px-2"
//                         >
//                             +{dayEvents.length - 3} {currentConfig.localization!.more}
//                         </Button>
//                     </motion.div>
//                 </EventListPopup>
//             );
//         }
//     };

//     return (
//         <Card className="h-full flex flex-col overflow-hidden">
//             <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
//                 <div className="min-w-[768px] relative">
//                     <div className="relative">
//                         {resourceDisplayMode === "row" ? (
//                             /* ===== ROW BASED DISPLAY (RESOURCES AS ROWS) ===== */
//                             <>
//                                 {/* Header */}
//                                 <div className="sticky top-0 z-30 bg-background grid grid-cols-8 gap-0"
//                                      style={{ gridTemplateColumns: `90px repeat(${weekDays.length}, minmax(120px, 1fr))` }}>
//                                     {/* Week number cell */}
//                                     <div className="sticky left-0 z-30 bg-background border-b border-r border-border p-2 h-[50px] flex items-center justify-center">
//                                         <div className="text-xs font-semibold text-center text-muted-foreground">
//                                             <span className="truncate">Week</span> {weekNumber}
//                                         </div>
//                                     </div>

//                                     {/* Day headers */}
//                                     {weekDays.map(day => (
//                                         <div
//                                             key={day.toString()}
//                                             className="border-b border-r border-border p-2 last:border-r-0 h-[50px] flex items-center justify-center"
//                                             onDoubleClick={() => handleDayDoubleClick(day)}
//                                         >
//                                             <div className="text-center">
//                                                 <div className="text-xs font-semibold">
//                                                     {currentConfig.localization!.dayNames[day.getDay()].slice(0, 3)}
//                                                 </div>
//                                                 <div className={cn(
//                                                     "text-sm",
//                                                     isSameDay(day, new Date()) &&
//                                                     "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto"
//                                                 )}>
//                                                     {format(day, 'd')}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Resource (Color) rows */}
//                                 {uniqueColors.map((color) => {
//                                     const colorOption = EVENT_COLOR_OPTIONS.find(opt => opt.value === color);

//                                     return (
//                                         <div key={color} className="grid gap-0" 
//                                              style={{ gridTemplateColumns: `90px repeat(${weekDays.length}, minmax(120px, 1fr))` }}>
//                                             {/* Resource label */}
//                                             <div className="sticky left-0 z-30 bg-background border-b border-r border-border p-2 flex items-center justify-center h-[125px]">
//                                                 <div className="flex items-center space-x-2">
//                                                     <div className={cn(
//                                                         "w-4 h-4 md:w-5 md:h-5 rounded-full flex-shrink-0",
//                                                         colorOption?.class
//                                                     )} />
//                                                     <span className="text-xs md:text-sm font-medium truncate max-w-[60px]">
//                                                         {colorOption?.label}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* Days cells */}
//                                             {weekDays.map(day => {
//                                                 const dayEvents = filteredEvents.filter(
//                                                     event => event.color === color && isEventInDay(event, day)
//                                                 );

//                                                 return (
//                                                     <div
//                                                         key={`${color}-${day.toString()}`}
//                                                         className="border-b border-r border-border p-2 h-[125px] last:border-r-0 relative group overflow-hidden"
//                                                         onDoubleClick={() => handleDayDoubleClick(day)}
//                                                     >
//                                                         <div className="relative z-10 h-full flex flex-col">
//                                                             <div className="flex-1 overflow-auto">
//                                                                 {dayEvents.slice(0, dayEvents.length > 4 ? 3 : 3).map((event, eventIndex) => 
//                                                                     renderEventCell(event, day, eventIndex)
//                                                                 )}
//                                                             </div>
                                                            
//                                                             <div className="mt-auto">
//                                                                 {renderAddOrMoreButton(dayEvents, day, color)}
//                                                             </div>
//                                                         </div>
                                                        
//                                                         {(isLoading && onDateRangeChange) && (
//                                                             <EventSkeleton className="absolute top-0 left-0 right-0 h-[2px] dark:h-[1px] animate-pulse bg-primary/20" />
//                                                         )}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     );
//                                 })}
//                             </>
//                         ) : (
//                             /* ===== COLUMN BASED DISPLAY (RESOURCES AS COLUMNS) ===== */
//                             <>
//                                 {/* Header with resource columns - Fixed width grid */}
//                                 <div className="sticky top-0 z-30 bg-background grid gap-0" 
//                                      style={{ gridTemplateColumns: `90px repeat(${uniqueColors.length}, minmax(120px, 1fr))` }}>
//                                     {/* Week label cell */}
//                                     <div className="sticky left-0 z-30 bg-background border-b border-r border-border p-2 h-[50px] flex items-center justify-center">
//                                         <div className="text-xs font-semibold text-center text-muted-foreground">
//                                             <span className="truncate">Week</span> {weekNumber}
//                                         </div>
//                                     </div>

//                                     {/* Resource headers */}
//                                     {uniqueColors.map(color => {
//                                         const colorOption = EVENT_COLOR_OPTIONS.find(opt => opt.value === color);
                                        
//                                         return (
//                                             <div
//                                                 key={color}
//                                                 className="border-b border-r border-border p-2 last:border-r-0 h-[50px] flex items-center justify-center"
//                                             >
//                                                 <div className="flex flex-col items-center justify-center">
//                                                     <div className={cn(
//                                                         "w-4 h-4 rounded-full",
//                                                         colorOption?.class
//                                                     )} />
//                                                     <div className="text-xs font-medium mt-1 truncate max-w-[90px] text-center">
//                                                         {colorOption?.label}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>

//                                 {/* Day rows with resource columns */}
//                                 {weekDays.map(day => (
//                                     <div 
//                                         key={day.toString()} 
//                                         className="grid gap-0"
//                                         style={{ gridTemplateColumns: `90px repeat(${uniqueColors.length}, minmax(120px, 1fr))` }}
//                                     >
//                                         {/* Day label */}
//                                         <div className="sticky left-0 z-30 bg-background border-b border-r border-border p-2 flex flex-col items-center justify-center h-[125px]"
//                                              onDoubleClick={() => handleDayDoubleClick(day)}>
//                                             <div className="font-semibold text-sm">
//                                                 {currentConfig.localization!.dayNames[day.getDay()].slice(0, 3)}
//                                             </div>
//                                             <div className={cn(
//                                                 "text-base w-7 h-7 flex items-center justify-center",
//                                                 isSameDay(day, new Date()) &&
//                                                 "bg-primary text-primary-foreground rounded-full"
//                                             )}>
//                                                 {format(day, 'd')}
//                                             </div>
//                                         </div>

//                                         {/* Resource columns */}
//                                         {uniqueColors.map(color => {
//                                             const dayEvents = filteredEvents.filter(
//                                                 event => event.color === color && isEventInDay(event, day)
//                                             );

//                                             return (
//                                                 <div
//                                                     key={`${day.toString()}-${color}`}
//                                                     className="border-b border-r border-border p-2 h-[125px] last:border-r-0 relative group overflow-hidden"
//                                                     onDoubleClick={() => handleDayDoubleClick(day)}
//                                                 >
//                                                     <div className="relative z-10 h-full flex flex-col">
//                                                         <div className="flex-1 overflow-auto">
//                                                             {dayEvents.slice(0, dayEvents.length > 4 ? 3 : 3).map((event, eventIndex) => 
//                                                                 renderEventCell(event, day, eventIndex)
//                                                             )}
//                                                         </div>
                                                        
//                                                         <div className="mt-auto">
//                                                             {renderAddOrMoreButton(dayEvents, day, color)}
//                                                         </div>
//                                                     </div>
                                                    
//                                                     {(isLoading && onDateRangeChange) && (
//                                                         <EventSkeleton className="absolute top-0 left-0 right-0 h-[2px] dark:h-[1px] animate-pulse bg-primary/20" />
//                                                     )}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 ))}
//                             </>
//                         )}
//                     </div>
//                 </div>
//                 <ScrollBar orientation="horizontal" />
//             </ScrollArea>
//         </Card>
//     );
// };

// export default WeekResourceView;
