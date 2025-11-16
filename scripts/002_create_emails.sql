-- Create emails table to store draft and sent emails
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_email text not null,
  recipient_name text,
  subject text not null,
  body text not null,
  ai_generated_body text,
  status text default 'draft', -- draft, sent
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable row level security
alter table public.emails enable row level security;

-- RLS Policies - users can only see their own emails
create policy "emails_select_own"
  on public.emails for select
  using (auth.uid() = user_id);

create policy "emails_insert_own"
  on public.emails for insert
  with check (auth.uid() = user_id);

create policy "emails_update_own"
  on public.emails for update
  using (auth.uid() = user_id);

create policy "emails_delete_own"
  on public.emails for delete
  using (auth.uid() = user_id);
