-- ============================================================
-- 001_2026_09_27_phase2_database
-- Phase 2: photo storage, XP ledger, leader tools, notes
-- ============================================================

-- ── 1. beta_students: photo_path + updated_at + trigger ─────

ALTER TABLE public.beta_students
  ADD COLUMN IF NOT EXISTS photo_path  text,
  ADD COLUMN IF NOT EXISTS updated_at  timestamptz DEFAULT now();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_beta_students_updated_at ON public.beta_students;
CREATE TRIGGER trg_beta_students_updated_at
  BEFORE UPDATE ON public.beta_students
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 2. Storage: private bucket student-photos + policies ─────

INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "teacher_read_own_photos"   ON storage.objects;
DROP POLICY IF EXISTS "teacher_insert_own_photos" ON storage.objects;
DROP POLICY IF EXISTS "teacher_update_own_photos" ON storage.objects;
DROP POLICY IF EXISTS "teacher_delete_own_photos" ON storage.objects;

CREATE POLICY "teacher_read_own_photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-photos'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "teacher_insert_own_photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-photos'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "teacher_update_own_photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'student-photos'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "teacher_delete_own_photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'student-photos'
    AND name LIKE (auth.uid()::text || '/%')
  );

-- ── 3. xp_events (points ledger) ────────────────────────────

CREATE TABLE IF NOT EXISTS public.xp_events (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL DEFAULT auth.uid(),
  student_id uuid        REFERENCES public.beta_students(id) ON DELETE CASCADE,
  class_id   uuid,
  app_source text        NOT NULL,
  delta      int         NOT NULL,
  reason     text,
  batch_id   uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS xp_events_student_id_idx ON public.xp_events (student_id);
CREATE INDEX IF NOT EXISTS xp_events_batch_id_idx   ON public.xp_events (batch_id);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "xp_events_owner" ON public.xp_events;
CREATE POLICY "xp_events_owner"
  ON public.xp_events FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 4. Replace student_xp_totals, add student_xp_by_app ─────

DROP VIEW IF EXISTS public.student_xp_totals;
CREATE VIEW public.student_xp_totals
  WITH (security_invoker = on) AS
  SELECT student_id, sum(delta)::bigint AS total_xp
  FROM   public.xp_events
  GROUP  BY student_id;

DROP VIEW IF EXISTS public.student_xp_by_app;
CREATE VIEW public.student_xp_by_app
  WITH (security_invoker = on) AS
  SELECT student_id, app_source, sum(delta)::bigint AS xp
  FROM   public.xp_events
  GROUP  BY student_id, app_source;

-- ── 5. leader_groups ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leader_groups (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL DEFAULT auth.uid(),
  class_id   uuid        REFERENCES public.classes(id) ON DELETE CASCADE,
  name       text,
  color      text,
  member_ids uuid[],
  leader_ids uuid[],
  locked     bool        DEFAULT false,
  sort       int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.leader_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leader_groups_owner" ON public.leader_groups;
CREATE POLICY "leader_groups_owner"
  ON public.leader_groups FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_leader_groups_updated_at ON public.leader_groups;
CREATE TRIGGER trg_leader_groups_updated_at
  BEFORE UPDATE ON public.leader_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 6. leader_history ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leader_history (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL DEFAULT auth.uid(),
  class_id   uuid,
  student_id uuid        REFERENCES public.beta_students(id) ON DELETE CASCADE,
  group_name text,
  led_on     date        DEFAULT current_date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leader_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leader_history_owner" ON public.leader_history;
CREATE POLICY "leader_history_owner"
  ON public.leader_history FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 7. class_notes ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.class_notes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  class_id     uuid        REFERENCES public.classes(id) ON DELETE CASCADE,
  app_source   text,
  group_id     uuid,
  content_html text,
  side         text        DEFAULT 'right',
  width        int         DEFAULT 360,
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.class_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "class_notes_owner" ON public.class_notes;
CREATE POLICY "class_notes_owner"
  ON public.class_notes FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_class_notes_updated_at ON public.class_notes;
CREATE TRIGGER trg_class_notes_updated_at
  BEFORE UPDATE ON public.class_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 8. note_templates ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.note_templates (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL DEFAULT auth.uid(),
  name         text,
  content_html text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.note_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "note_templates_owner" ON public.note_templates;
CREATE POLICY "note_templates_owner"
  ON public.note_templates FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 9. beta_profiles: add theme jsonb ───────────────────────

ALTER TABLE public.beta_profiles
  ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}';

-- ── 11. Realtime publication ─────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'beta_students'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.beta_students;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'xp_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.xp_events;
  END IF;
END $$;
