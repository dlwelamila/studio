"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from "./dialog";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    if (!date) {
      setDate(newDate);
      return;
    }

    const newDateAtTime = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );

    setDate(newDateAtTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(90vw,360px)] max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base">Select date & time</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
            initialFocus
          />
        </div>
        <div className="border-t border-border p-4">
          <TimePicker setDate={setDate} date={date} />
        </div>
        <DialogFooter className="border-t border-border bg-muted/20 p-3">
          <DialogClose asChild>
            <Button className="w-full">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}