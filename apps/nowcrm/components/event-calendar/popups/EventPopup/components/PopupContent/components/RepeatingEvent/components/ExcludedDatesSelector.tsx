// "use client";

// import { useState } from "react";
// import { format, isSameDay, eachDayOfInterval } from "date-fns";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import { EventCalendarTranslations } from "@/components/event-calendar/types";
// import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

// import { CalendarEventType } from "@/components/event-calendar/types";

// interface ExcludedDatesSelectorProps {
//   field: ControllerRenderProps<CalendarEventType, "isRepeatingExcludedDates">;
//   form: UseFormReturn<CalendarEventType>;
//   translations: EventCalendarTranslations;
// }

// // Component to display only relevant dates for exclusion based on repeat interval
// const ExcludedDatesSelector = ({
//   field,
//   form,
//   translations
// }: ExcludedDatesSelectorProps) => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
//   const monthsPerPage = 2;
  
//   const startDate = form.getValues('startDate');
//   const endDate = form.getValues('endDate');
//   const repeatInterval = form.getValues('isRepeatingInterval') || 'daily';

//   // Get all days in range that match the repeat pattern
//   const allDaysInRange = eachDayOfInterval({ start: startDate, end: endDate });

//   // Filter days strictly based on the repeat pattern
//   const matchingDays = allDaysInRange.filter(date => {
//     const interval = repeatInterval as 'daily' | 'weekly' | 'monthly';
    
//     if (interval === 'daily') {
//       return true; // All days match for daily pattern
//     } else if (interval === 'weekly') {
//       // Only exact same day of week (0-6, where 0 is Sunday)
//       return date.getDay() === startDate.getDay();
//     } else if (interval === 'monthly') {
//       // Only exact same day of month (1-31)
//       return date.getDate() === startDate.getDate();
//     }
//     return false;
//   });

//   // Validate excluded dates to make sure we don't have anything invalid
//   const currentExcluded = field.value as Date[] || [];
//   const validExcludedDates = currentExcluded.filter(excludedDate =>
//     matchingDays.some(validDate => isSameDay(excludedDate, validDate))
//   );

//   // If we removed some invalid dates, update the field
//   if (currentExcluded.length !== validExcludedDates.length) {
//     setTimeout(() => {
//       field.onChange(validExcludedDates);
//     }, 0);
//   }

//   // Helper function to verify if an operation would exclude all available dates
//   const wouldExcludeAllDates = (newExcludedDates: Date[]) => {
//     return newExcludedDates.length >= matchingDays.length;
//   };

//   // For daily interval, show regular calendar
//   if (repeatInterval === 'daily') {
//     return (
//       <Calendar
//         mode="multiple"
//         selected={field.value as Date[] || []}
//         onSelect={(dates) => {
//           if (dates && wouldExcludeAllDates(dates)) {
//             toast.error(translations.errorCannotExcludeAllDates || "Cannot exclude all dates in the range");
//             return;
//           }

//           field.onChange(dates || []);
//         }}
//         fromDate={startDate}
//         toDate={endDate}
//         defaultMonth={startDate}
//         className="rounded-md border"
//       />
//     );
//   }

//   // Group dates by year and month for better organization
//   const groupedDates = matchingDays.reduce<Record<string, Date[]>>((acc, date) => {
//     const yearMonthKey = format(date, 'yyyy-MM');
//     if (!acc[yearMonthKey]) {
//       acc[yearMonthKey] = [];
//     }
//     acc[yearMonthKey].push(date);
//     return acc;
//   }, {});

//   const groupedEntries = Object.entries(groupedDates).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

//   // Initialize expandedMonths if empty
//   if (Object.keys(expandedMonths).length === 0 && groupedEntries.length > 0) {
//     const initialState: Record<string, boolean> = {};
//     groupedEntries.forEach(([key], index) => {
//       initialState[key] = index === 0; // Only expand first month by default
//     });
//     setExpandedMonths(initialState);
//   }

//   const toggleMonth = (monthKey: string) => {
//     setExpandedMonths(prev => ({
//       ...prev,
//       [monthKey]: !prev[monthKey]
//     }));
//   };

//   const selectAll = (dates: Date[]) => {
//     const currentSelected = validExcludedDates;

//     // Find dates that aren't already selected
//     const newDates = dates.filter(date =>
//       !currentSelected.some(selected => isSameDay(selected, date))
//     );

//     const allNewExcludedDates = [...currentSelected, ...newDates];

//     // Check if we'd be excluding all dates
//     if (wouldExcludeAllDates(allNewExcludedDates)) {
//       toast.error(translations.errorCannotExcludeAllDates || "Cannot exclude all dates in the range");
//       return;
//     }

//     field.onChange(allNewExcludedDates);
//   };

//   const deselectAll = (dates: Date[]) => {
//     const currentSelected = validExcludedDates;

//     // Remove all dates from this month from selection
//     const filtered = currentSelected.filter(selected =>
//       !dates.some(date => isSameDay(date, selected))
//     );

//     field.onChange(filtered);
//   };

//   // Filter entries by search query
//   const filteredEntries = searchQuery.trim() === ''
//     ? groupedEntries
//     : groupedEntries.filter((entry) => {
//         const dates = entry[1];
//         const firstDate = dates[0];
//         const monthLabel = `${translations.monthNames[firstDate.getMonth()]} ${format(firstDate, 'yyyy')}`.toLowerCase();
//         return monthLabel.includes(searchQuery.toLowerCase());
//       });

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredEntries.length / monthsPerPage);
//   const paginatedEntries = filteredEntries.slice(
//     currentPage * monthsPerPage,
//     (currentPage + 1) * monthsPerPage
//   );

//   // Handle page changes
//   const goToNextPage = () => {
//     setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
//   };

//   const goToPrevPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 0));
//   };

//   return (
//     <div className="rounded-md p-1 w-[300px] overflow-y-auto">
//       <div className="text-center font-medium mb-2 text-sm">
//         {repeatInterval === 'weekly'
//           ? translations.weeklyIntervalLabel
//               .replace('{dayName}', translations.fullDayNames[startDate.getDay()])
//               .replace('{startDate}', `${format(startDate, 'dd')} ${translations.monthNames[startDate.getMonth()].slice(0, 3)}`)
//               .replace('{endDate}', `${format(endDate, 'dd')} ${translations.monthNames[endDate.getMonth()].slice(0, 3)} ${format(endDate, 'yyyy')}`)
//           : translations.monthlyIntervalLabel
//               .replace('{dayOfMonth}', format(startDate, 'do'))
//               .replace('{startDate}', translations.monthNames[startDate.getMonth()].slice(0, 3))
//               .replace('{endDate}', `${translations.monthNames[endDate.getMonth()].slice(0, 3)} ${format(endDate, 'yyyy')}`)}
//       </div>

//       <div className="flex gap-2 mb-2">
//         {/* Search input */}
//         <div className="flex-grow">
//           <Input
//             type="text"
//             placeholder={translations.searchMonthPlaceholder}
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(0); // Reset to first page on search
//             }}
//             className="h-7 text-xs"
//           />
//         </div>

//         {/* Pagination controls moved to top */}
//         {filteredEntries.length > 0 && (
//           <div className="flex items-center gap-1">
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="h-7 w-7 p-0"
//               onClick={goToPrevPage}
//               disabled={currentPage === 0}
//             >
//               ←
//             </Button>
//             <span className="text-xs text-muted-foreground whitespace-nowrap">
//               {currentPage + 1}/{Math.max(1, totalPages)}
//             </span>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="h-7 w-7 p-0"
//               onClick={goToNextPage}
//               disabled={currentPage >= totalPages - 1}
//             >
//               →
//             </Button>
//           </div>
//         )}
//       </div>

//       {matchingDays.length === 0 ? (
//         <div className="text-center text-muted-foreground py-1 text-xs">
//           {translations.noMatchingDates}
//         </div>
//       ) : filteredEntries.length === 0 ? (
//         <div className="text-center text-muted-foreground py-1 text-xs">
//           {translations.noSearchResults.replace('{query}', searchQuery)}
//         </div>
//       ) : (
//         <div>
//           {paginatedEntries.map(([yearMonth, dates]: [string, Date[]]) => {
//             const firstDate = dates[0];
//             const monthLabel = `${translations.monthNames[firstDate.getMonth()]} ${format(firstDate, 'yyyy')}`;
//             const isExpanded = expandedMonths[yearMonth];

//             // Count how many of this month's dates are selected
//             const selectedCount = dates.filter((date: Date) =>
//               validExcludedDates.some(selected => isSameDay(selected, date))
//             ).length;

//             return (
//               <div key={yearMonth} className="mb-2 border rounded-md overflow-hidden">
//                 <div
//                   className="py-1 px-2 bg-muted flex justify-between items-center cursor-pointer text-xs"
//                   onClick={() => toggleMonth(yearMonth)}
//                 >
//                   <div className="flex items-center">
//                     <span className="mr-1 flex items-center justify-center w-4">
//                       {isExpanded ? (
//                         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="m6 9 6 6 6-6" />
//                         </svg>
//                       ) : (
//                         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="m9 18 6-6-6-6" />
//                         </svg>
//                       )}
//                     </span>
//                     <span className="font-medium">{monthLabel}</span>
//                     <span className="ml-1 text-muted-foreground">
//                       {translations.ofExcluded
//                         .replace('{count}', selectedCount.toString())
//                         .replace('{total}', dates.length.toString())}
//                     </span>
//                   </div>

//                   <div className="flex gap-1">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="h-5 text-[10px] px-1"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         selectAll(dates);
//                       }}
//                     >
//                       {translations.selectAll}
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="h-5 text-[10px] px-1"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deselectAll(dates);
//                       }}
//                       disabled={selectedCount === 0}
//                     >
//                       {translations.clearAll}
//                     </Button>
//                   </div>
//                 </div>

//                 {isExpanded && (
//                   <div className="p-1 flex flex-wrap gap-1 bg-background">
//                     {dates.map((date: Date) => {
//                       const isSelected = validExcludedDates.some(
//                         selectedDate => isSameDay(selectedDate, date)
//                       );

//                       return (
//                         <Button
//                           key={date.toISOString()}
//                           type="button"
//                           variant={isSelected ? "default" : "outline"}
//                           className="h-6 px-1 text-[10px]"
//                           onClick={() => {
//                             const currentSelected = validExcludedDates;

//                             if (isSelected) {
//                               // Remove date if already selected
//                               field.onChange(
//                                 currentSelected.filter(
//                                   d => !isSameDay(d, date)
//                                 )
//                               );
//                             } else {
//                               // Add date if not already selected
//                               const newExcludedDates = [...currentSelected, date];

//                               if (wouldExcludeAllDates(newExcludedDates)) {
//                                 toast.error(translations.errorCannotExcludeAllDates ||
//                                   "Cannot exclude all dates in the range");
//                                 return;
//                               }

//                               field.onChange(newExcludedDates);
//                             }
//                           }}
//                         >
//                           {format(date, translations.dateButtonFormat)}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcludedDatesSelector;
