package com.example.EasyReport.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.EasyReport.entity.RefreshToken;
import com.example.EasyReport.repository.PatientRepository;
import com.example.EasyReport.repository.AdminRepository;
import com.example.EasyReport.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    @Value("${app.jwt.refresh.expiration}")
    private Long refreshTokenExpirationTime;

    private final RefreshTokenRepository refreshTokenRepository;
    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;

    public RefreshTokenService(
        RefreshTokenRepository refreshTokenRepository,
        PatientRepository patientRepository,
        AdminRepository adminRepository  // ✅ make sure you store this too!
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.patientRepository = patientRepository;
        this.adminRepository = adminRepository;
    }

    /** For Patients (normal flow) */
    public RefreshToken createRefreshToken(String email) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setPatient(
            patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found"))
        );
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationTime));
        return refreshTokenRepository.save(refreshToken);
    }

    /** ✅ NEW: For Admins (Demo flow) */
    public RefreshToken createAdminRefreshToken(String email) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setAdmin(
            adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"))
        );
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationTime));
        return refreshTokenRepository.save(refreshToken);
    }

    /** Common helpers */
    public boolean isTokenExpired(RefreshToken refreshToken) {
        return Instant.now().isAfter(refreshToken.getExpiryDate());
    }

    public void deleteRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.delete(refreshToken);
    }

    public RefreshToken getRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }
}