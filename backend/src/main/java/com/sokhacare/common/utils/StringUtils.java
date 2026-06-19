package com.sokhacare.common.utils;

import java.util.Locale;

public final class StringUtils {

    private StringUtils() {
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }
}
