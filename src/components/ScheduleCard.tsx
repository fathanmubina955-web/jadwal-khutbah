import { Calendar, CheckCircle2, User } from 'lucide-react';
import { KhatibSchedule } from '@/lib/schedule-data';
import { cn } from '@/lib/utils';

interface ScheduleCardProps {
  schedule: KhatibSchedule;
  onClick: () => void;
}

const ScheduleCard = ({ schedule, onClick }: ScheduleCardProps) => {
  const isBooked = !!schedule.khatib;

  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      className={cn(
        "w-full bg-card rounded-lg border p-4 md:p-5 text-left card-hover",
        "flex items-center justify-between gap-4",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isBooked 
          ? "opacity-75 cursor-default" 
          : "cursor-pointer hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0",
          isBooked ? "bg-muted" : "bg-accent"
        )}>
          <Calendar className={cn(
            "w-5 h-5 md:w-6 md:h-6",
            isBooked ? "text-muted-foreground" : "text-accent-foreground"
          )} />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground text-base md:text-lg">
            {schedule.formattedDate}
          </h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isBooked ? (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {schedule.khatib?.namaLengkap}
              </span>
            ) : (
              'Klik untuk mengisi jadwal khutbah'
            )}
          </p>
        </div>
      </div>
      <div className={cn(
        "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium shrink-0 flex items-center gap-1.5",
        isBooked 
          ? "bg-muted text-muted-foreground"
          : "bg-success-bg text-success-foreground"
      )}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        {isBooked ? 'Terisi' : 'Tersedia'}
      </div>
    </button>
  );
};

export default ScheduleCard;
