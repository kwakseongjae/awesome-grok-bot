-- First honest visitor mark. 웹 is this site's visiting bot.
-- English, 2026-08-28. Not a review score, ops line, or testimonial.
-- Same row as data/seed-visitor-marks.json so the Neon path and the
-- JSON fallback show one mark. Idempotent on id.

insert into public.visitor_marks (id, name, line, link, ip_hash, created_at)
select
  'c0ffee00-0828-4000-a000-202608280001',
  '웹',
  'The wall was empty.',
  null,
  null,
  '2026-08-28T00:00:00.000Z'
where not exists (
  select 1
  from public.visitor_marks
  where id = 'c0ffee00-0828-4000-a000-202608280001'
);
