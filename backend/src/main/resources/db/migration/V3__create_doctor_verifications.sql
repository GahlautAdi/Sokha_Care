create table doctor_verifications (
    id uuid primary key,
    doctor_id uuid not null references doctors (id) on delete cascade,
    license_number varchar(100) not null,
    medical_council varchar(120) not null,
    document_url varchar(500) not null,
    status varchar(32) not null default 'PENDING',
    submitted_at timestamptz not null,
    reviewed_at timestamptz,
    reviewed_by uuid references users (id) on delete set null,
    remarks varchar(1000),
    created_at timestamptz not null,
    updated_at timestamptz,
    created_by varchar(120) not null,
    updated_by varchar(120)
);

create index idx_doctor_verifications_doctor_id on doctor_verifications (doctor_id);
create index idx_doctor_verifications_status on doctor_verifications (status);
create index idx_doctor_verifications_submitted_at on doctor_verifications (submitted_at desc);
create unique index ux_doctor_verifications_active_request
    on doctor_verifications (doctor_id)
    where status in ('PENDING', 'UNDER_REVIEW');
