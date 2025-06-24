package com.example.EasyReport.dto;
import lombok.Data;

@Data
public class PatientLogInRequest {
    private String email;
    private String password;
}
