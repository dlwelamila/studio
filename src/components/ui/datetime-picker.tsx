"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input"
import { Label } from "./label"

type DateTimePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
        setDate(selectedDay);
        return;
    };
    if (!date) {
        setDate(selectedDay);
        return;
    }
    // Preserve the time part
    selectedDay.setHours(date.getHours());
    selectedDay.setMinutes(date.getMinutes());
    setDate(selectedDay);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  }
  
  const timeValue = date ? format(date, 'HH:mm') : '';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
         <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                />
            </PopoverContent>
        </Popover>
        <div className="grid gap-1.5">
            <Label htmlFor="time" className="text-sm">Time</Label>
            <Input id="time" type="time" value={timeValue} onChange={handleTimeChange} />
        </div>
    </div>
  )
}
