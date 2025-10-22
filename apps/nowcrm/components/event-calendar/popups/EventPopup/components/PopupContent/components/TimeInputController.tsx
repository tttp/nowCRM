"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

const TimeInputController = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const adjustTime = (direction: 'up' | 'down') => {
      const [hours, minutes] = value.split(':').map(Number);
      let newHours = hours;
      let newMinutes = minutes;

      if (direction === 'up') {
        newMinutes += 15;
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours = (newHours + 1) % 24;
        }
      } else {
        newMinutes -= 15;
        if (newMinutes < 0) {
          newMinutes = 45;
          newHours = (newHours - 1 + 24) % 24;
        }
      }

      const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      onChange(formattedTime);
    };

    return (
      <div className="relative">
        <Input
          type="time"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
          className="pr-8"
        />
        <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => adjustTime('up')}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => adjustTime('down')}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }
);

TimeInputController.displayName = 'TimeInput';

export default TimeInputController;
