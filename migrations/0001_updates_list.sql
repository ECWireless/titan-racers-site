-- The Titan Racers updates list: one list, email address only.

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  -- SHA-256 of the token in the subscriber's unsubscribe link.
  unsubscribe_token_hash text unique,
  -- Where they signed up, such as "titan-racers-site".
  source text,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  -- When a confirmation email last went out, for the per-address cooldown.
  confirmation_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists email_confirmations (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_confirmations_subscriber_id_idx
  on email_confirmations(subscriber_id);

-- Signup attempts per keyed hash of an IP address, counted per hour for rate
-- limiting. Windows older than a day are pruned as new attempts arrive.
create table if not exists signup_attempts (
  ip_hash text not null,
  window_start timestamptz not null,
  attempts integer not null,
  primary key (ip_hash, window_start)
);
