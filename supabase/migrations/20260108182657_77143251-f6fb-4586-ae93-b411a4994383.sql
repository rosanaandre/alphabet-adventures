-- Create guardians table (responsáveis)
CREATE TABLE public.guardians (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    pin_hash TEXT NOT NULL, -- 4-digit PIN stored securely
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create children table (crianças)
CREATE TABLE public.children (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#FF6B6B',
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create letter progress table
CREATE TABLE public.letter_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    letter CHAR(1) NOT NULL,
    sound_completed BOOLEAN DEFAULT false,
    writing_completed BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(child_id, letter)
);

-- Enable Row Level Security
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guardians
CREATE POLICY "Users can view their own guardian profile"
ON public.guardians FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guardian profile"
ON public.guardians FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guardian profile"
ON public.guardians FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for children
CREATE POLICY "Guardians can view their children"
ON public.children FOR SELECT
USING (guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid()));

CREATE POLICY "Guardians can create children"
ON public.children FOR INSERT
WITH CHECK (guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid()));

CREATE POLICY "Guardians can update their children"
ON public.children FOR UPDATE
USING (guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid()));

CREATE POLICY "Guardians can delete their children"
ON public.children FOR DELETE
USING (guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid()));

-- RLS Policies for letter_progress
CREATE POLICY "Guardians can view children progress"
ON public.letter_progress FOR SELECT
USING (child_id IN (
    SELECT c.id FROM public.children c
    JOIN public.guardians g ON c.guardian_id = g.id
    WHERE g.user_id = auth.uid()
));

CREATE POLICY "Guardians can create progress"
ON public.letter_progress FOR INSERT
WITH CHECK (child_id IN (
    SELECT c.id FROM public.children c
    JOIN public.guardians g ON c.guardian_id = g.id
    WHERE g.user_id = auth.uid()
));

CREATE POLICY "Guardians can update progress"
ON public.letter_progress FOR UPDATE
USING (child_id IN (
    SELECT c.id FROM public.children c
    JOIN public.guardians g ON c.guardian_id = g.id
    WHERE g.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_guardians_updated_at
BEFORE UPDATE ON public.guardians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_letter_progress_updated_at
BEFORE UPDATE ON public.letter_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();