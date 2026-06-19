package com.sokhacare.common.security;

import com.sokhacare.common.constants.SecurityConstants;
import com.sokhacare.modules.users.entity.Role;
import com.sokhacare.modules.users.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;
    private final boolean accountNonLocked;

    public static UserPrincipal from(User user) {
        List<GrantedAuthority> grantedAuthorities = user.getRoles().stream()
                .map(Role::authority)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toUnmodifiableList());
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                grantedAuthorities,
                user.isEnabled(),
                user.isAccountNonLocked()
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }
}
