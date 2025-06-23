package com.example.EasyReport.controller;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EasyReport.dto.OtpRequest;
import com.example.EasyReport.dto.OtpVerificationRequest;
import com.example.EasyReport.service.OtpService;

import com.example.EasyReport.repository.PatientRepository;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;
    private final PatientRepository patientRepository;

    public OtpController(OtpService otpService, PatientRepository patientRepository) {
        this.otpService = otpService;
        this.patientRepository = patientRepository;
        
    }

    @PostMapping("/send")
    public String sendOtp(@RequestBody OtpRequest otpRequest) {
        boolean sent = otpService.sendOtp(otpRequest.getEmail());
        return sent
            ? "OTP sent to " + otpRequest.getEmail()
            : "Failed to send OTP. Please try again.";
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest otpVerificationRequest) {
        boolean isValid = otpService.verifyOtp(
            otpVerificationRequest.getEmail(),
            otpVerificationRequest.getOtp()
        );
    
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Invalid or expired OTP."
            ));
        }
    
        var optionalPatient = patientRepository.findByEmail(otpVerificationRequest.getEmail());
    
        if (optionalPatient.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", "No user found with the given email."
            ));
        }
    
        var patient = optionalPatient.get();
    
        if (patient.isVerified()) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "success", true,
                "message", "Patient is already verified."
            ));
        }
    
        patient.setVerified(true);
        patientRepository.save(patient);
    
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "OTP verified successfully. Patient is now verified."
        ));
    }
}