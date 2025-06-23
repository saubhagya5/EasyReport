package com.example.EasyReport.repository;

import com.example.EasyReport.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByPhone(String phone);
    
}
