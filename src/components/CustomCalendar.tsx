import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, addMonths, subMonths } from "date-fns";
import { ar } from "date-fns/locale";

interface CustomCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabledBefore?: Date;
}

const WEEKDAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export default function CustomCalendar({ selected, onSelect, disabledBefore = startOfToday() }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();
  // Adjust for Saturday start (Saturday = 0 in our calendar)
  const paddingDays = firstDayOfWeek === 6 ? 0 : firstDayOfWeek + 1;

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDisabled = (date: Date) => isBefore(date, disabledBefore);
  const isSelected = (date: Date) => selected ? isSameDay(date, selected) : false;
  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="الشهر التالي"
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </button>

        <h2 className="text-xl font-bold text-primary">
          {format(currentMonth, "MMMM yyyy", { locale: ar })}
        </h2>

        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="الشهر السابق"
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-primary-light py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for padding */}
        {Array.from({ length: paddingDays }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {daysInMonth.map((day) => {
          const disabled = isDisabled(day);
          const selectedDay = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-xl font-semibold text-sm
                transition-all duration-200 ease-in-out
                ${disabled
                  ? 'text-gray-300 cursor-not-allowed opacity-40'
                  : 'hover:scale-110 hover:shadow-md cursor-pointer'
                }
                ${selectedDay
                  ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-lg scale-105 font-bold'
                  : today
                  ? 'bg-accent text-primary font-bold border-2 border-primary-light'
                  : 'bg-white text-primary hover:bg-accent-light border-2 border-transparent hover:border-accent'
                }
              `}
            >
              {format(day, "d", { locale: ar })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
