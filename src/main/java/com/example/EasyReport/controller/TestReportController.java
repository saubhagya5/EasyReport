package com.example.EasyReport.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.EasyReport.dto.TestReportFilter;
import com.example.EasyReport.entity.TestReport;
import com.example.EasyReport.repository.TestReportRepository;

@Controller
public class TestReportController {

    @Autowired
    private TestReportRepository reportRepo;

    @QueryMapping
    public List<TestReport> filterTestReports(@Argument TestReportFilter filter) {
        if (filter == null) {
            System.out.println("No filter provided, returning all reports.");
            return reportRepo.findAll();
        }

        System.out.println("Filter received: " + filter);

        List<TestReport> reports = reportRepo.findAll();
        System.out.println("Total reports fetched before filtering: " + reports.size());

        // Apply all filters in one stream
        reports = reports.stream()
                .filter(r -> filter.getEmail() == null || filter.getEmail().isEmpty() || 
                             (r.getPatientEmail() != null && r.getPatientEmail().equalsIgnoreCase(filter.getEmail())))
                .filter(r -> filter.getType() == null || filter.getType().isEmpty() ||
                             (r.getType() != null && r.getType().equalsIgnoreCase(filter.getType())))
                .filter(r -> filter.getStatus() == null || filter.getStatus().isEmpty() ||
                             (r.getStatus() != null && r.getStatus().equalsIgnoreCase(filter.getStatus())))
                .filter(r -> filter.getDate() == null || filter.getDate().isEmpty() ||
                             (r.getDate() != null && r.getDate().toString().equals(filter.getDate())))
                .filter(r -> filter.getName() == null || filter.getName().isEmpty() ||
                             (r.getPatient() != null && r.getPatient().getName() != null &&
                              r.getPatient().getName().equalsIgnoreCase(filter.getName())))
                .filter(r -> filter.getPhone() == null || filter.getPhone().isEmpty() ||
                             (r.getPatient() != null && r.getPatient().getPhone() != null &&
                              r.getPatient().getPhone().equalsIgnoreCase(filter.getPhone())))
                .filter(r -> filter.getId() == null || filter.getId().isEmpty() ||
                             (r.getPatient() != null && String.valueOf(r.getPatient().getId()).equals(filter.getId())))
                .collect(Collectors.toList());

        System.out.println("Filtered reports count: " + reports.size());
        return reports;
    }
}