'use client';
import { Input } from './input';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  TimePickerType,
  getArrowByType,
  getDateByType,
  setDateByType,
} from './time-picker-utils';

interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onLeftFocus?: () => void;
  onRightFocus?: () => void;
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className,
      type = 'number',
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowRight') onRightFocus?.();
      if (e.key === 'ArrowLeft') onLeftFocus?.();
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newDate = getArrowByType(date, 'up', picker);
        setDate(newDate);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newDate = getArrowByType(date, 'down', picker);
        setDate(newDate);
      }
      onKeyDown?.(e);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = setDateByType(date, e.target.value, picker);
      setDate(newDate);
      onChange?.(e);
    };

    const displayValue = React.useMemo(() => {
      if (!date) return '00';
      return getDateByType(date, picker);
    }, [date, picker]);

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          'w-[48px] text-center font-mono text-base tabular-nums caret-transparent selection:bg-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        value={value || displayValue}
        onChange={handleValueChange}
        type={type}
        inputMode="decimal"
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          e.target.select();
          setFlag(true);
        }}
        onBlur={() => setFlag(false)}
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = 'TimePickerInput';

export { TimePickerInput };
    