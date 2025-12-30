import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { KhatibSchedule, KhatibData, TEMPAT_TUGAS_OPTIONS } from '@/lib/schedule-data';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter').max(100),
  nip: z.string().min(8, 'NIP minimal 8 digit').max(30),
  noHP: z.string().min(10, 'Nomor HP minimal 10 digit').max(15),
  tempatTugas: z.string().min(1, 'Pilih tempat tugas'),
  saran: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface KhatibFormDialogProps {
  schedule: KhatibSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (schedule: KhatibSchedule, data: KhatibData) => Promise<void>;
}

const KhatibFormDialog = ({ schedule, open, onOpenChange, onSubmit }: KhatibFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: '',
      nip: '',
      noHP: '',
      tempatTugas: '',
      saran: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!schedule) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(schedule, {
        namaLengkap: data.namaLengkap,
        nip: data.nip,
        noHP: data.noHP,
        tempatTugas: data.tempatTugas,
        saran: data.saran,
      });
      
      toast.success('Jadwal berhasil disimpan!', {
        description: `${data.namaLengkap} terdaftar sebagai Khatib pada ${schedule.formattedDate}`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Gagal menyimpan jadwal', {
        description: 'Terjadi kesalahan, silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl md:text-2xl">
            Isi Jadwal Khutbah
          </DialogTitle>
          {schedule && (
            <p className="text-muted-foreground text-sm">
              {schedule.formattedDate}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama dan Gelar Lengkap</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Dr. H. Ahmad Yani, M.Ag." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="197001011995031001" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noHP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP / WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="081234567890" 
                      type="tel"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tempatTugas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Tugas</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tempat tugas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEMPAT_TUGAS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saran untuk Kemajuan Masjid Kampus 2 (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tuliskan saran Anda..."
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Jadwal'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default KhatibFormDialog;
