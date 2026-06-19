create table doctor_availabilities (
    id uuid primary key,
    doctor_id uuid not null references doctors (id) on delete cascade,
    day_of_week varchar(16) not null,
    start_time time not null,
    end_time time not null,
    consultation_mode varchar(16) not null,
    active boolean not null default true,
    created_at timestamptz not null,
    updated_at timestamptz,
    created_by varchar(120) not null,
    updated_by varchar(120)
);

create index idx_doctor_availabilities_doctor_id on doctor_availabilities (doctor_id);
create index idx_doctor_availabilities_doctor_day on doctor_availabilities (doctor_id, day_of_week);
create index idx_doctor_availabilities_active on doctor_availabilities (active);
