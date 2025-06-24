package com.example.EasyReport.repository;

import com.example.EasyReport.entity.RefreshToken;
import java.util.Optional;
import com.example.EasyReport.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
        Optional<RefreshToken> findByToken(String token);
        
    void deleteByPatient(Patient patient);
}
