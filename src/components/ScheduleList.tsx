import { useMemo } from 'react';
import { KhatibSchedule, groupByMonth, MONTHS } from '@/lib/schedule-data';
import ScheduleCard from './ScheduleCard';

interface ScheduleListProps {
  schedules: KhatibSchedule[];
  onSelectSchedule: (schedule: KhatibSchedule) => void;
}

const ScheduleList = ({ schedules, onSelectSchedule }: ScheduleListProps) => {
  const groupedSchedules = useMemo(() => groupByMonth(schedules), [schedules]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {MONTHS.map((month, idx) => {
          const monthSchedules = groupedSchedules.get(month);
          if (!monthSchedules || monthSchedules.length === 0) return null;

          return (
            <section key={month} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 md:mb-6">
                {month}
              </h2>
              <div className="space-y-3">
                {monthSchedules.map(schedule => (
                  <ScheduleCard
                    key={schedule.dateString}
                    schedule={schedule}
                    onClick={() => onSelectSchedule(schedule)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleList;
