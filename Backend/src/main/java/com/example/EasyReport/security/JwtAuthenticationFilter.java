package com.example.EasyReport.security;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.EasyReport.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   CustomUserDetailsService customUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {
    
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth") || path.startsWith("/api/otp") || path.startsWith("/api/admin")) {
            filterChain.doFilter(request, response);
            System.out.println("Skipping JWT filter for path: " + path);
            return;
        }
        System.out.println("hello " + path);
        String header = request.getHeader("Authorization");
    
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
    
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getemailFromToken(token);
    
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
    
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
    
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
    
        filterChain.doFilter(request, response);
    }
}