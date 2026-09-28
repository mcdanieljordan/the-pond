-- ============================================================
-- 002_2026_09_28_growgrit
-- GrowGrit (fitness growth tracker): tables, RLS, storage buckets.
-- Nothing here drops or deletes existing data.
-- Reuses: public.classes, public.beta_students, public.xp_events,
--         storage bucket student-photos, public.set_updated_at().
-- ============================================================

-- ── 1. fitness_settings (one row per teacher: class order, level names, courses) ──
CREATE TABLE IF NOT EXISTS public.fitness_settings (
  user_id    uuid        PRIMARY KEY DEFAULT auth.uid(),
  data       jsonb       NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- ── 2. fitness_tests (custom tests only; FitnessGram tests are built into the app) ──
CREATE TABLE IF NOT EXISTS public.fitness_tests (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL DEFAULT auth.uid(),
  name       text        NOT NULL,
  test_type  text        NOT NULL CHECK (test_type IN ('laps','timed_reps','inarow_reps','time','distance')),
  unit       text,
  direction  text        NOT NULL DEFAULT 'higher' CHECK (direction IN ('higher','lower','none')),
  attempts   int         NOT NULL DEFAULT 1 CHECK (attempts BETWEEN 1 AND 3),
  scoring    text        NOT NULL DEFAULT 'best' CHECK (scoring IN ('best','avg','avg2')),
  config     jsonb       DEFAULT '{}',
  sort       int         DEFAULT 0,
  deleted    boolean     DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── 3. fitness_sessions (BOY / MOY / EOY per class per school year) ──
CREATE TABLE IF NOT EXISTS public.fitness_sessions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  class_id     uuid        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  period       text        NOT NULL CHECK (period IN ('BOY','MOY','EOY')),
  school_year  text        NOT NULL,
  session_date date,
  deleted      boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (class_id, period, school_year)
);

-- ── 4. fitness_results (one row per student per test per session; up to 3 attempts) ──
CREATE TABLE IF NOT EXISTS public.fitness_results (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid(),
  session_id  uuid        NOT NULL REFERENCES public.fitness_sessions(id) ON DELETE CASCADE,
  student_id  uuid        NOT NULL REFERENCES public.beta_students(id) ON DELETE CASCADE,
  test_id     text        NOT NULL,          -- 'pacer','pushups','curlups','sitreach','bmi' or a fitness_tests.id
  attempts    jsonb       DEFAULT '[]',
  score       numeric,
  extra       jsonb       DEFAULT '{}',      -- height_in, weight_lb, course_m …
  xp          int         DEFAULT 0,
  deleted     boolean     DEFAULT false,
  recorded_at timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (session_id, student_id, test_id)
);

-- ── 5. student_photos (GIF-style frames; bytes are AES-GCM encrypted in student-photos bucket) ──
CREATE TABLE IF NOT EXISTS public.student_photos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  student_id   uuid        NOT NULL REFERENCES public.beta_students(id) ON DELETE CASCADE,
  storage_path text        NOT NULL,
  sort         int         DEFAULT 0,
  deleted      boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── 6. technique_videos (teaching demos only — no student footage) ──
CREATE TABLE IF NOT EXISTS public.technique_videos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  test_id      text        NOT NULL,
  title        text,
  storage_path text        NOT NULL,
  mime         text,
  size_bytes   bigint,
  deleted      boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── 7. sound_bites (0–3 s clips; meant to be shared with Ribbit Rabbit) ──
CREATE TABLE IF NOT EXISTS public.sound_bites (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  name         text        NOT NULL,
  storage_path text        NOT NULL,
  mime         text,
  duration_ms  int,
  color        text,
  sort         int         DEFAULT 0,
  source_app   text        DEFAULT 'growgrit',
  deleted      boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Column/table notes
COMMENT ON COLUMN public.fitness_results.xp IS
  'Display copy only. The real points ledger is xp_events, written with BFT_STUDENTS.award() (app_source = growgrit).';
COMMENT ON TABLE public.student_photos IS
  'Extra animation frames only. The main profile photo is beta_students.photo_path (BFT_STUDENTS.uploadPhoto).';

-- ── 8. Indexes ──
CREATE INDEX IF NOT EXISTS fitness_tests_user_idx      ON public.fitness_tests (user_id);
CREATE INDEX IF NOT EXISTS fitness_sessions_user_idx   ON public.fitness_sessions (user_id);
CREATE INDEX IF NOT EXISTS fitness_results_user_idx    ON public.fitness_results (user_id);
CREATE INDEX IF NOT EXISTS fitness_results_student_idx ON public.fitness_results (student_id);
CREATE INDEX IF NOT EXISTS student_photos_student_idx  ON public.student_photos (student_id);
CREATE INDEX IF NOT EXISTS technique_videos_user_idx   ON public.technique_videos (user_id);
CREATE INDEX IF NOT EXISTS sound_bites_user_idx        ON public.sound_bites (user_id);

-- ── 9. updated_at triggers (reuses public.set_updated_at from migration 001) ──
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['fitness_settings','fitness_tests','fitness_sessions','fitness_results',
                           'student_photos','technique_videos','sound_bites']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$s', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$s
                    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- ── 10. RLS: every row belongs to the signed-in teacher ──
ALTER TABLE public.fitness_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_tests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_results  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technique_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sound_bites      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fitness_settings_owner" ON public.fitness_settings;
CREATE POLICY "fitness_settings_owner" ON public.fitness_settings FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "fitness_tests_owner" ON public.fitness_tests;
CREATE POLICY "fitness_tests_owner" ON public.fitness_tests FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- sessions: teacher must also own the class
DROP POLICY IF EXISTS "fitness_sessions_owner" ON public.fitness_sessions;
CREATE POLICY "fitness_sessions_owner" ON public.fitness_sessions FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()));

-- results + photos: teacher must also own the student's class
DROP POLICY IF EXISTS "fitness_results_owner" ON public.fitness_results;
CREATE POLICY "fitness_results_owner" ON public.fitness_results FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.beta_students s JOIN public.classes c ON c.id = s.class_id
    WHERE s.id = student_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS "student_photos_owner" ON public.student_photos;
CREATE POLICY "student_photos_owner" ON public.student_photos FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.beta_students s JOIN public.classes c ON c.id = s.class_id
    WHERE s.id = student_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS "technique_videos_owner" ON public.technique_videos;
CREATE POLICY "technique_videos_owner" ON public.technique_videos FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "sound_bites_owner" ON public.sound_bites;
CREATE POLICY "sound_bites_owner" ON public.sound_bites FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ── 11. Storage buckets (private; files live under <teacher uid>/...) ──
-- student-photos already exists (migration 001) with per-teacher policies.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('technique-videos', 'technique-videos', false, 104857600, ARRAY['video/mp4','video/quicktime','video/webm'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('sound-bites', 'sound-bites', false, 2097152,
        ARRAY['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/ogg','audio/webm','audio/mp4','audio/aac','audio/x-m4a'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "gg_media_select" ON storage.objects;
DROP POLICY IF EXISTS "gg_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "gg_media_update" ON storage.objects;
DROP POLICY IF EXISTS "gg_media_delete" ON storage.objects;

CREATE POLICY "gg_media_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('technique-videos','sound-bites') AND name LIKE (auth.uid()::text || '/%'));
CREATE POLICY "gg_media_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('technique-videos','sound-bites') AND name LIKE (auth.uid()::text || '/%'));
CREATE POLICY "gg_media_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('technique-videos','sound-bites') AND name LIKE (auth.uid()::text || '/%'));
CREATE POLICY "gg_media_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('technique-videos','sound-bites') AND name LIKE (auth.uid()::text || '/%'));
