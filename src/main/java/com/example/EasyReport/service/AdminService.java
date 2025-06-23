package com.example.EasyReport.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EasyReport.entity.Admin;
import com.example.EasyReport.repository.AdminRepository;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }
    public Admin createAdmin(Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        return adminRepository.save(admin);
    }
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }
}
