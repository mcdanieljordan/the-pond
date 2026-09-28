-- ============================================================
-- 003_2026_09_28_leader_and_app_photos
-- Shared leader flag on beta_students (Rule A).
-- Per-app photo overrides via student_app_photos (Rule B).
-- No data drops or deletes.
-- ============================================================

-- ── 1. Shared leader flag ────────────────────────────────────
ALTER TABLE public.beta_students
  ADD COLUMN IF NOT EXISTS is_leader boolean DEFAULT false;

-- ── 2. student_app_photos ────────────────────────────────────
-- One row per (student, app). photo_path points to student-photos bucket.
-- When present the app shows this photo instead of beta_students.photo_path.
CREATE TABLE IF NOT EXISTS public.student_app_photos (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid(),
  student_id  uuid        NOT NULL REFERENCES public.beta_students(id) ON DELETE CASCADE,
  app_source  text        NOT NULL,
  photo_path  text        NOT NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (student_id, app_source)
);

ALTER TABLE public.student_app_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_photos_owner" ON public.student_app_photos;
CREATE POLICY "app_photos_owner"
  ON public.student_app_photos FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS student_app_photos_student_idx
  ON public.student_app_photos (student_id, app_source);

DROP TRIGGER IF EXISTS trg_student_app_photos_updated_at ON public.student_app_photos;
CREATE TRIGGER trg_student_app_photos_updated_at
  BEFORE UPDATE ON public.student_app_photos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 3. Realtime ───────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND tablename = 'student_app_photos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.student_app_photos;
  END IF;
END $$;
