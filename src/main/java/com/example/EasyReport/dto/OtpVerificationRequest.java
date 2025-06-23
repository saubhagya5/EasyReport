package com.example.EasyReport.dto;

import lombok.Data;
@Data
public class OtpVerificationRequest {
    private String email;
    private String otp;
    private String userType;
}