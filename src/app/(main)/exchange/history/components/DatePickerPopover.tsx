"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerPopoverProps {
  selectedRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DatePickerPopover({ selectedRange, onChange }: DatePickerPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      onChange(normalizeDateRange(range));
    },
    [onChange],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative flex !h-11 w-full items-center justify-between rounded-xl border-none bg-white text-black text-sm font-medium pl-10 pr-4 hover:bg-neutral-50 active:bg-neutral-100"
          aria-expanded={isOpen}
        >
          <CalendarIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <span className="min-w-0 flex-1 truncate text-left font-medium">
            {formatPeriod(selectedRange)}
          </span>
          <ChevronDown className="size-4 text-neutral-400 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
          className="bg-white text-neutral-900 border border-neutral-200 rounded-2xl shadow-xl p-4"
        />
      </PopoverContent>
    </Popover>
  );
}

function formatPeriod(range: DateRange | undefined) {
  const normalizedRange = normalizeDateRange(range);

  if (!normalizedRange?.from) {
    return "기간 선택";
  }

  if (!normalizedRange.to) {
    return `시작 ${formatDate(normalizedRange.from)} · 종료 선택`;
  }

  return `시작 ${formatDate(normalizedRange.from)} · 종료 ${formatDate(normalizedRange.to)}`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function normalizeDateRange(range: DateRange | undefined): DateRange | undefined {
  if (!range?.from || !range.to) {
    return range;
  }

  return range.from <= range.to ? range : { from: range.to, to: range.from };
}
