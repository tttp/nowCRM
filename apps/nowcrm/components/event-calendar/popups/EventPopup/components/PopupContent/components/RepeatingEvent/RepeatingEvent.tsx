// "use client";

// import { useState } from "react";
// import { format, isSameYear, eachDayOfInterval, isSameDay } from "date-fns";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarDays, Calendar1, CalendarRange, AlertCircle } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { CalendarEventType, EventCalendarTranslations } from "@/components/event-calendar/types";
// import { doesDateMatchRepeatPattern } from "@/components/event-calendar/utils/doesDateMatchRepeatPattern";
// import { UseFormReturn } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import ExcludedDatesSelector from "./components/ExcludedDatesSelector";

// interface RepeatingEventProps {
//     form: UseFormReturn<CalendarEventType>;
//     translations: EventCalendarTranslations;
//     showRepeatToggle: boolean;
// }

// const RepeatingEvent = ({
//     form,
//     translations,
//     showRepeatToggle
// }: RepeatingEventProps) => {
//     const [showExcludedDates, setShowExcludedDates] = useState(false);

//     // Initialize showExcludedDates based on whether there are excluded dates
//     useState(() => {
//         const excludedDates = form.getValues('isRepeatingExcludedDates');
//         if (excludedDates && excludedDates.length > 0) {
//             setShowExcludedDates(true);
//         }
//     });

//     const getRepeatDescription = (
//         startDate: Date,
//         endDate: Date,
//         startTime: string,
//         endTime: string,
//         interval: 'daily' | 'weekly' | 'monthly' | undefined,
//         excludedDates?: Date[]
//     ): string => {
//         const formatDate = (date: Date) => format(date, 'MMM d');
//         const formatDateYear = (date: Date) => format(date, 'MMM d, yyyy');
//         const dayName = translations.fullDayNames[startDate.getDay()];

//         const dayOfMonth = translations.language === 'enUS'
//             ? format(startDate, 'do')
//             : startDate.getDate().toString();

//         const start = formatDate(startDate);
//         const end = isSameYear(startDate, endDate) ? formatDate(endDate) : formatDateYear(endDate);
//         const timeRange = `${startTime} - ${endTime}`;

//         const repeatInterval = interval || 'daily';
//         let description = '';

//         switch (repeatInterval) {
//             case 'daily':
//                 description = translations.repeatDailyDescription
//                     .replace('{timeRange}', timeRange)
//                     .replace('{startDate}', start)
//                     .replace('{endDate}', end);
//                 break;
//             case 'weekly':
//                 description = translations.repeatWeeklyDescription
//                     .replace('{dayName}', dayName)
//                     .replace('{timeRange}', timeRange)
//                     .replace('{startDate}', start)
//                     .replace('{endDate}', end);
//                 break;
//             case 'monthly':
//                 description = translations.repeatMonthlyDescription
//                     .replace('{dayOfMonth}', dayOfMonth)
//                     .replace('{timeRange}', timeRange)
//                     .replace('{startDate}', start)
//                     .replace('{endDate}', end);
//                 break;
//         }

//         if (excludedDates && excludedDates.length > 0) {
//             const excludedCount = excludedDates.length;
//             const excludedInfo = translations.withExcludedDates
//                 .replace('{count}', excludedCount.toString())
//                 .replace('{s}', excludedCount > 1 ? 's' : '');
//             description += ` (${excludedInfo})`;
//         }

//         return description;
//     };

//     if (!showRepeatToggle) {
//         return null;
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <FormItem className="flex flex-col rounded-lg border p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                     <div className="space-y-2">
//                         <FormLabel className="text-base flex items-center cursor-pointer">
//                             <CalendarRange className="mr-2 h-4 w-4 flex-shrink-0" />
//                             <span className="leading-tight">
//                                 {translations.repeatingEventQuestion}
//                             </span>
//                         </FormLabel>
                        
//                         <AnimatePresence mode="wait">
//                             {form.watch('isRepeating') && (
//                                 <motion.div
//                                     initial={{ opacity: 0, height: 0 }}
//                                     animate={{ opacity: 1, height: "auto" }}
//                                     transition={{
//                                         duration: 0.2,
//                                         ease: "easeInOut"
//                                     }}
//                                 >
//                                     <FormDescription className="text-xs leading-normal max-w-[90%]">
//                                         {getRepeatDescription(
//                                             form.watch('startDate'),
//                                             form.watch('endDate'),
//                                             form.watch('startTime'),
//                                             form.watch('endTime'),
//                                             form.watch('isRepeatingInterval'),
//                                             form.watch('isRepeatingExcludedDates')
//                                         )}
//                                     </FormDescription>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                     <FormField
//                         control={form.control}
//                         name="isRepeating"
//                         render={({ field }) => (
//                             <FormControl>
//                                 <Switch
//                                     checked={field.value}
//                                     onCheckedChange={(checked) => {
//                                         field.onChange(checked);
//                                         if (!checked) {
//                                             setShowExcludedDates(false);
//                                             form.setValue('isRepeatingExcludedDates', []);
//                                         }
//                                     }}
//                                     className="flex-shrink-0"
//                                 />
//                             </FormControl>
//                         )}
//                     />
//                 </div>

//                 <AnimatePresence>
//                     {form.watch('isRepeating') && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.15 }}
//                         >
//                             <div className="space-y-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="isRepeatingInterval"
//                                     render={({ field }) => (
//                                         <Select
//                                             onValueChange={(value) => {
//                                                 // Clear excluded dates when changing interval
//                                                 if (value !== field.value) {
//                                                     form.setValue('isRepeatingExcludedDates', []);
//                                                     setShowExcludedDates(false);
//                                                 }
//                                                 field.onChange(value);
//                                             }}
//                                             value={field.value || 'daily'}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 <SelectItem value="daily">
//                                                     <div className="flex items-center">
//                                                         <Calendar1 className="mr-2 h-4 w-4" />
//                                                         {translations.repeatDaily}
//                                                     </div>
//                                                 </SelectItem>
//                                                 <SelectItem value="weekly">
//                                                     <div className="flex items-center">
//                                                         <CalendarRange className="mr-2 h-4 w-4" />
//                                                         {translations.repeatWeekly}
//                                                     </div>
//                                                 </SelectItem>
//                                                 <SelectItem value="monthly">
//                                                     <div className="flex items-center">
//                                                         <CalendarDays className="mr-2 h-4 w-4" />
//                                                         {translations.repeatMonthly}
//                                                     </div>
//                                                 </SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     )}
//                                 />

//                                 <div className="flex items-center justify-between mt-4">
//                                     <div className="space-y-2">
//                                         <FormLabel className="flex items-center text-sm cursor-pointer">
//                                             <AlertCircle className="mr-2 h-3 w-3" />
//                                             {translations.excludedDates}
//                                         </FormLabel>
//                                         <FormDescription className="text-xs">
//                                             {translations.excludedDatesDescription}
//                                         </FormDescription>
//                                     </div>
//                                     <Switch
//                                         checked={showExcludedDates}
//                                         onCheckedChange={(checked) => {
//                                             setShowExcludedDates(checked);
//                                             if (!checked) {
//                                                 form.setValue('isRepeatingExcludedDates', []);
//                                             }
//                                         }}
//                                         className="flex-shrink-0"
//                                     />
//                                 </div>

//                                 <AnimatePresence>
//                                     {showExcludedDates && (
//                                         <motion.div
//                                             initial={{ opacity: 0, height: 0 }}
//                                             animate={{ opacity: 1, height: "auto" }}
//                                             exit={{ opacity: 0, height: 0 }}
//                                             transition={{ duration: 0.05, ease: "easeInOut" }}
//                                             className="mt-4"
//                                         >
//                                             <FormField
//                                                 control={form.control}
//                                                 name="isRepeatingExcludedDates"
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <div className="space-y-4">
//                                                             <Popover>
//                                                                 <PopoverTrigger asChild>
//                                                                     <Button
//                                                                         variant="outline"
//                                                                         className="w-full justify-start text-left font-normal text-sm h-9"
//                                                                         type="button"
//                                                                     >
//                                                                         <CalendarDays className="mr-2 h-4 w-4" />
//                                                                         {translations.selectDatesToExclude}
//                                                                     </Button>
//                                                                 </PopoverTrigger>
//                                                                 <PopoverContent className="w-auto p-0 max-w-[320px]" align="start">
//                                                                     <ExcludedDatesSelector
//                                                                         field={field}
//                                                                         form={form}
//                                                                         translations={translations}
//                                                                     />
//                                                                 </PopoverContent>
//                                                             </Popover>

//                                                             {/* Only show quick presets for daily repetition with animation */}
//                                                             <AnimatePresence>
//                                                                 {form.watch('isRepeatingInterval') === 'daily' && (
//                                                                     <motion.div
//                                                                         initial={{ opacity: 0, height: 0, overflow: "hidden" }}
//                                                                         animate={{ opacity: 1, height: "auto", overflow: "visible" }}
//                                                                         exit={{ opacity: 0, height: 0, overflow: "hidden" }}
//                                                                         transition={{ duration: 0.015, ease: "easeInOut" }}
//                                                                         className="space-y-2"
//                                                                     >
//                                                                         <div className="flex items-center justify-between mb-2">
//                                                                             <FormDescription className="text-xs mb-0">
//                                                                                 {translations.skipDays}
//                                                                             </FormDescription>
//                                                                             <Button
//                                                                                 type="button"
//                                                                                 variant="destructive"
//                                                                                 size="sm"
//                                                                                 className="text-xs h-5 mr-3"
//                                                                                 disabled={!((form.watch('isRepeatingExcludedDates') || []).length > 0)}
//                                                                                 onClick={() => {
//                                                                                     form.setValue('isRepeatingExcludedDates', []);
//                                                                                 }}
//                                                                             >
//                                                                                 {translations.clearAll}
//                                                                             </Button>
//                                                                         </div>

//                                                                         <div>
//                                                                             <div className="grid grid-cols-7 gap-1 mb-2">
//                                                                                 {translations.dayNames.map((dayName, index) => {
//                                                                                     // Convert index to day number (0 = Sunday, 1 = Monday, etc.)
//                                                                                     const dayNumber = index;
//                                                                                     const currentExcluded = form.watch('isRepeatingExcludedDates') || [];
//                                                                                     const startDate = form.getValues('startDate');
//                                                                                     const endDate = form.getValues('endDate');
//                                                                                     const allDaysInRange = eachDayOfInterval({ start: startDate, end: endDate });

//                                                                                     const daysOfThisType = allDaysInRange.filter(date => date.getDay() === dayNumber);
//                                                                                     const isRelevant = daysOfThisType.length > 0;

//                                                                                     const isExcluded = isRelevant && daysOfThisType.every(day =>
//                                                                                         currentExcluded.some(date => isSameDay(date, day)));

//                                                                                     return (
//                                                                                         <Button
//                                                                                             key={index}
//                                                                                             type="button"
//                                                                                             variant={isExcluded ? "default" : "outline"}
//                                                                                             size="sm"
//                                                                                             className={cn(
//                                                                                                 "w-8 h-8 p-0 text-center flex items-center justify-center",
//                                                                                                 (dayNumber === 0 || dayNumber === 6) ? "font-medium" : "",
//                                                                                                 !isRelevant ? "opacity-50 cursor-not-allowed" : ""
//                                                                                             )}
//                                                                                             disabled={!isRelevant}
//                                                                                             onClick={() => {
//                                                                                                 if (!isRelevant) return;
//                                                                                                 const startDate = form.getValues('startDate');
//                                                                                                 const endDate = form.getValues('endDate');

//                                                                                                 const allDays = eachDayOfInterval({ start: startDate, end: endDate });
//                                                                                                 const specificDays = allDays.filter(date => date.getDay() === dayNumber);
//                                                                                                 const currentExcluded = form.getValues('isRepeatingExcludedDates') || [];
//                                                                                                 let newExcluded = [...currentExcluded];

//                                                                                                 if (isExcluded) {
//                                                                                                     newExcluded = newExcluded.filter(excludedDate =>
//                                                                                                         !specificDays.some(day => isSameDay(day, excludedDate))
//                                                                                                     );
//                                                                                                 } else {
//                                                                                                     specificDays.forEach(day => {
//                                                                                                         if (!newExcluded.some(date => isSameDay(date, day))) {
//                                                                                                             newExcluded.push(day);
//                                                                                                         }
//                                                                                                     });

//                                                                                                     const repeatInterval = 'daily';

//                                                                                                     const actualEventDays = allDays.filter(date =>
//                                                                                                         doesDateMatchRepeatPattern(date, startDate, endDate, repeatInterval)
//                                                                                                     );

//                                                                                                     if (newExcluded.length >= actualEventDays.length) {
//                                                                                                         toast.error(translations.errorCannotExcludeAllDates);
//                                                                                                         return;
//                                                                                                     }
//                                                                                                 }

//                                                                                                 form.setValue('isRepeatingExcludedDates', newExcluded);
//                                                                                             }}
//                                                                                         >
//                                                                                             {dayName.charAt(0)}
//                                                                                         </Button>
//                                                                                     );
//                                                                                 })}
//                                                                             </div>
//                                                                         </div>
//                                                                     </motion.div>
//                                                                 )}
//                                                             </AnimatePresence>

//                                                             {(field.value && field.value.length > 0) && (
//                                                                 <div className="flex flex-wrap gap-1 mt-2">
//                                                                     {(field.value as Date[]).map((date, index) => (
//                                                                         <motion.div
//                                                                             key={date.toISOString()}
//                                                                             className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs flex items-center"
//                                                                             initial={{
//                                                                                 opacity: 0,
//                                                                                 scale: 0.6,
//                                                                                 y: 15,
//                                                                                 rotateX: -10
//                                                                             }}
//                                                                             animate={{
//                                                                                 opacity: 1,
//                                                                                 scale: 1,
//                                                                                 y: 0,
//                                                                                 rotateX: 0
//                                                                             }}
//                                                                             whileHover={{ scale: 1.05 }}
//                                                                             transition={{
//                                                                                 type: "spring",
//                                                                                 stiffness: 500,
//                                                                                 damping: 30,
//                                                                                 delay: 0
//                                                                             }}
//                                                                         >
//                                                                             {format(date, 'MMM d, yyyy')}
//                                                                             <Button
//                                                                                 type="button"
//                                                                                 variant="ghost"
//                                                                                 size="sm"
//                                                                                 className="h-4 w-4 p-0 ml-1"
//                                                                                 onClick={() => {
//                                                                                     const currentDates = field.value as Date[] || [];
//                                                                                     const newDates = [...currentDates];
//                                                                                     newDates.splice(index, 1);
//                                                                                     field.onChange(newDates);
//                                                                                 }}
//                                                                             >
//                                                                                 <span className="sr-only">Remove</span>
//                                                                                 ×
//                                                                             </Button>
//                                                                         </motion.div>
//                                                                     ))}
//                                                                 </div>
//                                                             )}
//                                                             <FormMessage />
//                                                         </div>
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </FormItem>
//         </motion.div>
//     );
// };

// export default RepeatingEvent;
