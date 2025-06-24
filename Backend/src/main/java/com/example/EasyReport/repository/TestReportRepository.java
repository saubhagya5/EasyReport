package com.example.EasyReport.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.EasyReport.entity.TestReport;

public interface  TestReportRepository extends JpaRepository<TestReport, Long> {
    
    List<TestReport> findByPatientId(Long patientId);
    
    List<TestReport> findByType(String type);
    
    List<TestReport> findByStatus(String status);
    
    List<TestReport> findByPatientEmail(String email);

    Optional<TestReport> findById(Long id);
    
    @EntityGraph(attributePaths = "patient")
    List<TestReport> findAll();
}

