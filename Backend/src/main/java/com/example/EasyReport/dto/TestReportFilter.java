package com.example.EasyReport.dto;

import lombok.Data;

@Data
public class TestReportFilter {
    private String date;
    private String email;
    private String name;
    private String phone;
    private String id;      
    private String status;
    private String type;
}