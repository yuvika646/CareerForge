-- Job Tracker: Applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  company text not null,
  role text not null,
  status text not null default 'wishlist'
    check (status in ('wishlist', 'applied', 'interview', 'offer', 'rejected')),
  salary text,
  date_applied timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.applications enable row level security;

-- Users can only see their own applications
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

-- Users can insert their own applications
create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Users can update their own applications
create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

-- Users can delete their own applications
create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists idx_applications_user_id on public.applications(user_id);
create index if not exists idx_applications_status on public.applications(status);
