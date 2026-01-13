"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

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
        months: "flex flex-col gap-4",
        month: "space-y-3",

        // Month header
        caption: "relative flex items-center justify-center",
        caption_label: "text-sm font-medium",

        // Nav
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 absolute left-1 top-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 absolute right-1 top-1"
        ),

        // Grid (don’t force full width; let content size itself)
        month_grid: "border-collapse",

        // Weekdays row (Su Mo Tu...)
        weekdays: "table-header-group",
        weekday:
          "table-cell w-9 text-center text-muted-foreground font-normal text-[0.8rem] pb-1",

        // Weeks + week rows
        weeks: "table-row-group",
        week: "table-row",

        // Day cell + button
        day: "table-cell h-9 w-9 p-0 text-center align-middle",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),

        // States
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",

        // Range (if you use mode='range')
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...p }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", className)} {...p} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", className)} {...p} />
          ),
      }}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }),
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"
export { Calendar }
