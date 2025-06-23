package com.example.EasyReport.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;
import com.example.EasyReport.repository.TestReportRepository;

import com.example.EasyReport.entity.TestReport;

@RestController
public class TestReportUploadController {

    @Autowired
    private TestReportRepository reportRepo;

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/api/reports/{id}/upload")
    public ResponseEntity<TestReport> uploadPdf(
        @PathVariable Long id,
        @RequestParam MultipartFile file) throws Exception {

        TestReport report = reportRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Report not found"));

        String pdfUrl;
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "raw" )
            );
            pdfUrl = (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload PDF", e);
        }

        report.setPdfUrl(pdfUrl);
        report.setStatus("finished");
        reportRepo.save(report);

        return ResponseEntity.ok(report);
    }
}
