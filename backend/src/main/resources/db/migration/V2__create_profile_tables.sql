create table patients (
    id uuid primary key,
    user_id uuid not null unique references users (id) on delete cascade,
    date_of_birth date not null,
    gender varchar(32) not null,
    phone_number varchar(20) not null,
    blood_group varchar(32) not null,
    address varchar(500) not null,
    emergency_contact_name varchar(100) not null,
    emergency_contact_phone varchar(20) not null,
    allergy_summary varchar(1000) not null,
    created_at timestamptz not null,
    updated_at timestamptz,
    created_by varchar(120) not null,
    updated_by varchar(120)
);

create index idx_patients_user_id on patients (user_id);

create table doctors (
    id uuid primary key,
    user_id uuid not null unique references users (id) on delete cascade,
    specialty varchar(120) not null,
    consultation_fee numeric(10, 2) not null,
    bio varchar(2000) not null,
    consultation_mode varchar(32) not null,
    profile_photo_url varchar(500),
    active boolean not null default true,
    created_at timestamptz not null,
    updated_at timestamptz,
    created_by varchar(120) not null,
    updated_by varchar(120)
);

create index idx_doctors_user_id on doctors (user_id);
create index idx_doctors_active on doctors (active);
