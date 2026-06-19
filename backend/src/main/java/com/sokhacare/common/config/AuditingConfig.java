package com.sokhacare.common.config;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.security.SecurityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class AuditingConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> SecurityUtils.currentUserEmail().or(() -> java.util.Optional.of(ApiConstants.SYSTEM_AUDITOR));
    }
}
