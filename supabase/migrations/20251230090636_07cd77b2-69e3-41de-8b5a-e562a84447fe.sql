-- Create table for Khatib registrations
CREATE TABLE public.khatib_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_date DATE NOT NULL UNIQUE,
  nama_lengkap TEXT NOT NULL,
  nip TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  tempat_tugas TEXT NOT NULL,
  saran TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.khatib_schedules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read schedules (public display)
CREATE POLICY "Anyone can view khatib schedules" 
ON public.khatib_schedules 
FOR SELECT 
USING (true);

-- Allow anyone to insert schedules (no auth required for registration)
CREATE POLICY "Anyone can register as khatib" 
ON public.khatib_schedules 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_khatib_schedules_updated_at
BEFORE UPDATE ON public.khatib_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();