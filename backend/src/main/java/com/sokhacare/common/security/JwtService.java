package com.sokhacare.common.security;

import com.sokhacare.common.config.JwtProperties;
import com.sokhacare.common.constants.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;
    private final Clock clock;

    public String generateAccessToken(UserPrincipal userPrincipal) {
        return buildToken(userPrincipal, SecurityConstants.TOKEN_TYPE_ACCESS, jwtProperties.accessTokenExpiration());
    }

    public String generateRefreshToken(UserPrincipal userPrincipal) {
        return buildToken(userPrincipal, SecurityConstants.TOKEN_TYPE_REFRESH, jwtProperties.refreshTokenExpiration());
    }

    public boolean isTokenValid(String token, UserDetails userDetails, String expectedTokenType) {
        String username = extractUsername(token);
        return username.equalsIgnoreCase(userDetails.getUsername())
                && expectedTokenType.equalsIgnoreCase(extractTokenType(token))
                && !isTokenExpired(token);
    }

    public boolean isRefreshToken(String token) {
        return SecurityConstants.TOKEN_TYPE_REFRESH.equalsIgnoreCase(extractTokenType(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get(SecurityConstants.CLAIM_TOKEN_TYPE, String.class));
    }

    private String buildToken(UserPrincipal userPrincipal, String tokenType, java.time.Duration ttl) {
        Instant now = clock.instant();
        return Jwts.builder()
                .setIssuer(jwtProperties.issuer())
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(ttl)))
                .addClaims(Map.of(
                        SecurityConstants.CLAIM_TOKEN_TYPE, tokenType,
                        SecurityConstants.CLAIM_ROLES, userPrincipal.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
                ))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(Date.from(clock.instant()));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
        return claimsJws.getBody();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
