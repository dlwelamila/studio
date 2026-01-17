"use client"

import * as React from "react"
import { DayPicker, UI, DayFlag, SelectionState } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]: "flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4",
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-center pt-1 relative items-center",
        [UI.CaptionLabel]: "text-sm font-medium",
        [UI.Nav]: "relative flex items-center justify-center space-x-1",
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.MonthGrid]: "w-full border-collapse",
        [UI.Weekdays]: "grid grid-cols-7",
        [UI.Weekday]: "text-muted-foreground font-normal text-[0.8rem] h-9 flex items-center justify-center",
        [UI.Week]: "grid grid-cols-7 mt-2",
        [UI.Day]: "relative flex h-9 items-center justify-center text-center text-sm p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        [DayFlag.outside]: "day-outside [&>button]:text-muted-foreground [&>button]:opacity-50",
        [DayFlag.disabled]: "[&>button]:text-muted-foreground [&>button]:opacity-50",
        [DayFlag.hidden]: "invisible",
        [DayFlag.today]: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        [SelectionState.selected]: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus-visible]:bg-primary [&>button:focus-visible]:text-primary-foreground",
        [SelectionState.range_middle]: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        [SelectionState.range_end]: "day-range-end",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }