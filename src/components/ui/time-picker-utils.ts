'use client';
import {
  getYear,
  getMonth,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';

export type TimePickerType = 'hours' | 'minutes' | 'seconds' | '12hours';
export type TimePickerPosition = 'left' | 'right' | 'up' | 'down';

export function getArrowByType(
  date: Date,
  type: TimePickerPosition,
  picker: TimePickerType
) {
  const delta = type === 'up' || type === 'right' ? 1 : -1;
  switch (picker) {
    case 'hours':
      const newHours = getHours(date) + delta;
      return setHours(date, newHours);
    case 'minutes':
      const newMinutes = getMinutes(date) + delta;
      return setMinutes(date, newMinutes);
    case 'seconds':
      const newSeconds = getSeconds(date) + delta;
      return setSeconds(date, newSeconds);
    case '12hours':
      const new12Hours = getHours(date) + delta * 12;
      return setHours(date, new12Hours);
    default:
      return date;
  }
}

export function setDateByType(date: Date, value: string, type: TimePickerType) {
  switch (type) {
    case 'hours':
      return setHours(date, parseInt(value));
    case 'minutes':
      return setMinutes(date, parseInt(value));
    case 'seconds':
      return setSeconds(date, parseInt(value));
    default:
      return date;
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case 'hours':
      return getHours(date).toString().padStart(2, '0');
    case 'minutes':
      return getMinutes(date).toString().padStart(2, '0');
    case 'seconds':
      return getSeconds(date).toString().padStart(2, '0');
    case '12hours':
      return getHours(date) > 12 ? 'PM' : 'AM';
    default:
      return '00';
  }
}
    