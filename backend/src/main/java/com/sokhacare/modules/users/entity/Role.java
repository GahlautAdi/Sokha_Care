package com.sokhacare.modules.users.entity;

public enum Role {
    PATIENT,
    DOCTOR,
    PHARMACY,
    SUPPORT,
    MODERATOR,
    ADMIN,
    SUPER_ADMIN;

    public String authority() {
        return "ROLE_" + name();
    }
}
