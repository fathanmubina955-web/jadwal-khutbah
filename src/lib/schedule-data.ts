import { format, eachDayOfInterval, startOfYear, endOfYear, getDay } from 'date-fns';
import { id } from 'date-fns/locale';

export interface KhatibSchedule {
  date: Date;
  dateString: string;
  formattedDate: string;
  month: string;
  monthIndex: number;
  weekOfMonth: number;
  khatib?: KhatibData;
}

export interface KhatibData {
  namaLengkap: string;
  nip: string;
  noHP: string;
  tempatTugas: string;
  saran?: string;
}

// Generate all Fridays in 2026
export function generateFridays2026(): KhatibSchedule[] {
  const year = 2026;
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  
  const allDays = eachDayOfInterval({ start, end });
  const fridays = allDays.filter(day => getDay(day) === 5);
  
  return fridays.map((date, index) => {
    const monthIndex = date.getMonth();
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const fridaysInMonthBefore = fridays.filter(f => 
      f.getMonth() === monthIndex && f < date
    ).length;
    
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      formattedDate: format(date, "EEEE, d MMMM yyyy", { locale: id }),
      month: format(date, 'MMMM', { locale: id }),
      monthIndex,
      weekOfMonth: fridaysInMonthBefore + 1,
    };
  });
}

// Group schedules by month
export function groupByMonth(schedules: KhatibSchedule[]): Map<string, KhatibSchedule[]> {
  const grouped = new Map<string, KhatibSchedule[]>();
  
  schedules.forEach(schedule => {
    const existing = grouped.get(schedule.month) || [];
    grouped.set(schedule.month, [...existing, schedule]);
  });
  
  return grouped;
}

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const TEMPAT_TUGAS_OPTIONS = [
  'Al-Jami\'ah',
  'Fakultas Adab dan Humaniora',
  'Fakultas Dakwah dan Komunikasi',
  'Fakultas Ekonomi dan Bisnis Islam',
  'Fakultas Ilmu Sosial dan Ilmu Politik',
  'Fakultas Psikologi',
  'Fakultas Sains dan Teknologi',
  'Fakultas Syariah dan Hukum',
  'Fakultas Tarbiyah dan Keguruan',
  'Fakultas Ushuluddin',
  'Pascasarjana',
];
