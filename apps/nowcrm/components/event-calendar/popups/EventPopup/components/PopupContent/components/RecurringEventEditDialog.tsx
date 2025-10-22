"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarPlus } from "lucide-react";
import { EventCalendarTranslations } from "@/components/event-calendar/types";

interface RecurringEventEditDialogProps {
    open: boolean;
    editType: 'single' | 'future' | 'all';
    onEditTypeChange: (value: 'single' | 'future' | 'all') => void;
    onConfirm: () => void;
    onClose: () => void;
    translations: EventCalendarTranslations;
}

export const RecurringEventEditDialog: React.FC<RecurringEventEditDialogProps> = ({
    open,
    editType,
    onEditTypeChange,
    onConfirm,
    onClose,
    translations
}) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className={"max-w-[425px]"}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <CalendarPlus className="mr-2 h-5 w-5 text-primary" />
                        {translations.editRecurringEventTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        {translations.editRecurringEventDescription}
                    </AlertDialogDescription>
                    <div className="h-2"></div>
                    <div className="mt-4 space-y-4">
                        <RadioGroup
                            defaultValue="all"
                            value={editType}
                            onValueChange={(value) => onEditTypeChange(value as 'single' | 'future' | 'all')}
                        >
                            <div className="space-y-4">
                                {[
                                    {
                                        value: 'single',
                                        label: translations.editThisOccurrence,
                                        description: translations.editThisOccurrenceDescription
                                    },
                                    {
                                        value: 'future',
                                        label: translations.editThisAndFuture,
                                        description: translations.editThisAndFutureDescription
                                    },
                                    {
                                        value: 'all',
                                        label: translations.editAllOccurrences,
                                        description: translations.editAllOccurrencesDescription
                                    }
                                ].map(option => (
                                    <div key={option.value} className="flex space-x-4">
                                        <RadioGroupItem value={option.value} id={`edit-${option.value}`} />
                                        <Label
                                            htmlFor={`edit-${option.value}`}
                                            className="flex flex-col flex-1 items-start cursor-pointer"
                                        >
                                            <span className="leading-none">{option.label}</span>
                                            <span className="text-sm text-muted-foreground mt-1">
                                                {option.description}
                                            </span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="h-2"></div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        {translations.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="w-full sm:w-auto"
                    >
                        <CalendarPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {translations.save}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RecurringEventEditDialog;
