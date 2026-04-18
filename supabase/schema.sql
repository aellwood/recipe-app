-- Run this in the Supabase SQL editor to set up the database schema.

create table public.recipes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete cascade not null,
  title       text        not null,
  description text        not null default '',
  image       text        not null default '',
  prep_time   integer     not null default 0,
  cook_time   integer     not null default 0,
  servings    integer     not null default 1,
  difficulty  text        not null default 'Medium' check (difficulty in ('Easy', 'Medium', 'Hard')),
  tags        text[]      not null default '{}',
  ingredients jsonb       not null default '[]',
  steps       text[]      not null default '{}',
  is_custom   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create table public.meal_plan (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  day         text not null,
  meal        text not null,
  recipe_id   uuid references public.recipes(id) on delete cascade not null,
  unique(user_id, day, meal)
);

create table public.shopping_items (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete cascade not null,
  text       text        not null,
  checked    boolean     not null default false,
  created_at timestamptz not null default now()
);

alter table public.recipes        enable row level security;
alter table public.meal_plan      enable row level security;
alter table public.shopping_items enable row level security;

create policy "Users manage own recipes"
  on public.recipes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own meal plan"
  on public.meal_plan for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own shopping items"
  on public.shopping_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
