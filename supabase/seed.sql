-- =============================================
-- TrainSmart Seed Data (Demo Programs)
-- =============================================

-- Insert demo programs
INSERT INTO programs (id, title, description, category, duration_minutes, exercise_count, is_free, price_cents) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Rücken Basics', 'Grundübungen für einen starken und schmerzfreien Rücken', 'ruecken', 15, 8, FALSE, 2900),
  ('22222222-2222-2222-2222-222222222222', 'Hüfte Mobilität', 'Verbessere deine Hüftbeweglichkeit mit gezielten Übungen', 'huefte', 12, 6, FALSE, 2900),
  ('33333333-3333-3333-3333-333333333333', 'Knie Stabilität', 'Stärke und stabilisiere deine Kniegelenke', 'knie', 20, 10, FALSE, 2900),
  ('44444444-4444-4444-4444-444444444444', 'Willkommen bei TrainSmart', 'Kostenlose Einführung in unsere Trainingsmethodik', 'welcome', 5, 3, TRUE, NULL);

-- Insert demo exercises for Welcome program (free)
INSERT INTO exercises (program_id, title, description, duration_seconds, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Einführung', 'Lerne TrainSmart kennen', 60, 1),
  ('44444444-4444-4444-4444-444444444444', 'Richtig Aufwärmen', 'So bereitest du dich optimal vor', 120, 2),
  ('44444444-4444-4444-4444-444444444444', 'Erste Übung', 'Deine erste Trainingsübung', 90, 3);

-- Insert demo exercises for Rücken Basics
INSERT INTO exercises (program_id, title, description, duration_seconds, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Aufwärmen', 'Mobilisierung der Wirbelsäule', 60, 1),
  ('11111111-1111-1111-1111-111111111111', 'Cat-Cow Stretch', 'Flexibilität für den unteren Rücken', 90, 2),
  ('11111111-1111-1111-1111-111111111111', 'Bird-Dog', 'Stabilität und Koordination', 120, 3),
  ('11111111-1111-1111-1111-111111111111', 'Brücke', 'Kräftigung der Rückenmuskulatur', 90, 4),
  ('11111111-1111-1111-1111-111111111111', 'Superman', 'Stärkung der Rückenstrecker', 60, 5),
  ('11111111-1111-1111-1111-111111111111', 'Seitliche Planke', 'Core-Stabilität', 90, 6),
  ('11111111-1111-1111-1111-111111111111', 'Childs Pose', 'Entspannung und Dehnung', 60, 7),
  ('11111111-1111-1111-1111-111111111111', 'Cool-Down', 'Ausklang des Trainings', 60, 8);
