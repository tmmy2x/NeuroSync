import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)


create table organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamptz default now()
  );
  
  create table memberships (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade,
    organization_id uuid references organizations on delete cascade,
    role text default 'member',
    created_at timestamptz default now()
  );
  