import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateFridays2026, KhatibSchedule, KhatibData } from '@/lib/schedule-data';
import { format } from 'date-fns';

interface DbKhatibSchedule {
  id: string;
  schedule_date: string;
  nama_lengkap: string;
  nip: string;
  no_hp: string;
  tempat_tugas: string;
  saran: string | null;
  created_at: string;
  updated_at: string;
}

export function useKhatibSchedules() {
  const queryClient = useQueryClient();
  const fridays = generateFridays2026();

  const { data: dbSchedules, isLoading, error } = useQuery({
    queryKey: ['khatib-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('khatib_schedules')
        .select('*')
        .order('schedule_date', { ascending: true });
      
      if (error) throw error;
      return data as DbKhatibSchedule[];
    },
  });

  // Merge local fridays with database data
  const schedules: KhatibSchedule[] = fridays.map(friday => {
    const dbEntry = dbSchedules?.find(
      db => db.schedule_date === format(friday.date, 'yyyy-MM-dd')
    );
    
    if (dbEntry) {
      return {
        ...friday,
        khatib: {
          namaLengkap: dbEntry.nama_lengkap,
          nip: dbEntry.nip,
          noHP: dbEntry.no_hp,
          tempatTugas: dbEntry.tempat_tugas,
          saran: dbEntry.saran || undefined,
        },
      };
    }
    
    return friday;
  });

  const registerMutation = useMutation({
    mutationFn: async ({ schedule, data }: { schedule: KhatibSchedule; data: KhatibData }) => {
      const { error } = await supabase
        .from('khatib_schedules')
        .insert({
          schedule_date: format(schedule.date, 'yyyy-MM-dd'),
          nama_lengkap: data.namaLengkap,
          nip: data.nip,
          no_hp: data.noHP,
          tempat_tugas: data.tempatTugas,
          saran: data.saran || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khatib-schedules'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (scheduleDate: string) => {
      const { error } = await supabase
        .from('khatib_schedules')
        .delete()
        .eq('schedule_date', scheduleDate);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khatib-schedules'] });
    },
  });

  const getAllSchedules = async () => {
    const { data, error } = await supabase
      .from('khatib_schedules')
      .select('*')
      .order('schedule_date', { ascending: true });

    if (error) throw error;
    return data as DbKhatibSchedule[];
  };

  return {
    schedules,
    isLoading,
    error,
    registerKhatib: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    deleteKhatib: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    getAllSchedules,
  };
}
