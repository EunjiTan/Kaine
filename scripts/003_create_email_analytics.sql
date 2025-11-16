-- Create email_analytics table to track email metrics
create table if not exists public.email_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email_id uuid references public.emails(id) on delete cascade,
  sent_at timestamp with time zone default now(),
  response_time_seconds integer,
  was_ai_generated boolean default false,
  time_saved_seconds integer default 0
);

-- Enable row level security
alter table public.email_analytics enable row level security;

-- RLS Policies - users can only see their own analytics
create policy "analytics_select_own"
  on public.email_analytics for select
  using (auth.uid() = user_id);

create policy "analytics_insert_own"
  on public.email_analytics for insert
  with check (auth.uid() = user_id);
