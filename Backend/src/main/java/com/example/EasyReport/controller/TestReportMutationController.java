package com.example.EasyReport.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

import com.cloudinary.Cloudinary;
import com.example.EasyReport.dto.CreateTestReportInput;
import com.example.EasyReport.entity.Patient;
import com.example.EasyReport.entity.TestReport;
import com.example.EasyReport.repository.PatientRepository;
import com.example.EasyReport.repository.TestReportRepository;
import com.example.EasyReport.service.FileStorageService;

@Controller
public class TestReportMutationController {

    @Autowired
    private TestReportRepository reportRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private Cloudinary cloudinary;

    @MutationMapping
    public TestReport updateReportStatus(@Argument Long id, @Argument String status) {
        TestReport report = reportRepo.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        return reportRepo.save(report);
    }

    @MutationMapping
    public TestReport createTestReport(@Argument CreateTestReportInput input) {

    // Try to find patient by email only (ignore phone)
    Patient patient = null;
    if (input.getPatientEmail() != null && !input.getPatientEmail().isEmpty()) {
        patient = patientRepo.findByEmail(input.getPatientEmail()).orElse(null);
    }

    // Create new TestReport
    TestReport report = new TestReport();
    report.setType(input.getType());
    report.setStatus(input.getStatus());
    report.setPatient(patient); // set Patient object if found, else null
    report.setPatientEmail(input.getPatientEmail()); // always store patientEmail field

    // Parse date safely
    try {
        report.setDate(LocalDate.parse(input.getDate()));
    } catch (Exception e) {
        throw new RuntimeException("Invalid date format, expected yyyy-MM-dd");
    }

    return reportRepo.save(report);
}
}