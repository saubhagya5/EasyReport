package com.example.EasyReport.dto;
import lombok.Data;

@Data
public class PatientSignupRequest {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String password;
}
