-- application_reviews.created_at held the date the reviewer picks, at midnight UTC, so
-- reviews couldn't be ordered by when they were submitted. Keep the picked date in its own
-- column and let created_at record the real submission time (its default, now()).

alter table public.application_reviews add column review_date date;

-- Existing rows: created_at is the picked date at midnight UTC.
update public.application_reviews
set review_date = (created_at at time zone 'UTC')::date;

-- No default: every insert must say which date the reviewer chose. A default would quietly
-- use the database's (UTC) date.
alter table public.application_reviews
  alter column review_date set not null;

comment on column public.application_reviews.review_date is
  'The review date the reviewer chose. created_at is when the review was submitted.';
