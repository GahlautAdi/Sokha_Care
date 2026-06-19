create table users (
    id uuid primary key,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    enabled boolean not null default true,
    account_non_locked boolean not null default true,
    created_at timestamptz not null,
    updated_at timestamptz,
    created_by varchar(120) not null,
    updated_by varchar(120)
);

create index idx_users_email on users (email);
create index idx_users_enabled on users (enabled);

create table user_roles (
    user_id uuid not null references users (id) on delete cascade,
    role varchar(50) not null,
    primary key (user_id, role)
);
