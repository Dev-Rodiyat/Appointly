import { addDays, format, isSameDay, parseISO } from 'date-fns';

export const next7DaysCounts = (items) => {
  const days = Array.from({length: 7}, (_,i) => addDays(new Date(), i));
  return days.map(d => ({
    day: format(d, 'EEE'),
    count: items.filter(a => isSameDay(parseISO(a.date), d)).length
  }));
};

export const statusBreakdown = (items) => {
  const statuses = ['scheduled','completed','cancelled','no-show'];
  return statuses.map(s => ({ name: s, value: items.filter(a => a.status === s).length }));
};
