package com.example.EasyReport.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.EasyReport.entity.Patient;
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByEmail(String email);
    
    Optional<Patient> findByPhone(String phone);

}
