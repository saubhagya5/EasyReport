package com.example.EasyReport.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.EasyReport.entity.TestReport;
import com.example.EasyReport.dto.PatientLogInRequest;
import com.example.EasyReport.dto.PatientSignupRequest;
import com.example.EasyReport.entity.Admin;
import com.example.EasyReport.entity.Patient;
import com.example.EasyReport.entity.RefreshToken;
import com.example.EasyReport.repository.TestReportRepository;
import com.example.EasyReport.repository.AdminRepository;
import com.example.EasyReport.repository.PatientRepository;
import com.example.EasyReport.security.JwtTokenProvider;
import com.example.EasyReport.service.OtpService;
import com.example.EasyReport.service.RefreshTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder; 
    private final TestReportRepository testReportRepository;
    
    @Autowired
    public AuthController(
            RefreshTokenService refreshTokenService,
            JwtTokenProvider jwtTokenProvider,
            PatientRepository patientRepository,
            AdminRepository adminRepository,
            OtpService otpService,
            PasswordEncoder passwordEncoder,
            TestReportRepository testReportRepository
    ) {
        this.refreshTokenService = refreshTokenService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.patientRepository = patientRepository;
        this.adminRepository = adminRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.testReportRepository = testReportRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid PatientSignupRequest patientDto) {
        Optional<Patient> existingEmail = patientRepository.findByEmail(patientDto.getEmail());
    
        Patient savedPatient;
    
        if (existingEmail.isPresent()) {
            Patient existingPatient = existingEmail.get();
    
            if (existingPatient.isVerified()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                        "success", false,
                        "message", "Email already exists and is verified"
                ));
            }
    
            existingPatient.setName(patientDto.getName());
            existingPatient.setPhone(patientDto.getPhone());
            existingPatient.setPassword(passwordEncoder.encode(patientDto.getPassword()));
            savedPatient = patientRepository.save(existingPatient);
    
            otpService.sendOtp(existingPatient.getEmail());
    
        } else {
    
            if (patientRepository.findByPhone(patientDto.getPhone()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                        "success", false,
                        "message", "Phone number already exists"
                ));
            }
    
            Patient newPatient = new Patient();
            newPatient.setEmail(patientDto.getEmail());
            newPatient.setName(patientDto.getName());
            newPatient.setPhone(patientDto.getPhone());
            newPatient.setPassword(passwordEncoder.encode(patientDto.getPassword()));
            newPatient.setVerified(false);
    
            savedPatient = patientRepository.save(newPatient);
    
            otpService.sendOtp(newPatient.getEmail());
        }
        List<TestReport> reportsWithEmail = testReportRepository.findByPatientEmail(patientDto.getEmail());
        for (TestReport report : reportsWithEmail) {
            report.setPatient(savedPatient);
            testReportRepository.save(report);
        }
    
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "OTP sent to email. Please verify."
        ));
    }
    @PostMapping("/login")
    public ResponseEntity<?> patientLogin(@RequestBody PatientLogInRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isEmpty() || !passwordEncoder.matches(password, patientOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid credentials"
            ));
        }

        Patient patient = patientOpt.get();
        if (!patient.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Account not verified. Please Sign in."
            ));
        }

        String token = jwtTokenProvider.generateToken(email);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(email);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "data", Map.of(
                        "token", token,
                        "refreshToken", refreshToken.getToken()
                )
        ));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody PatientLogInRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Admin admin = adminRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (admin == null || !passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
            ));
        }

        otpService.sendOtp(email);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                "success", true,
                "message", "OTP sent to email"
        ));
    }
    @PostMapping("/demo")
    public ResponseEntity<?> demoLogin() {

        System.out.println("Demo login endpoint hit");
        Admin demoAdmin = adminRepository.findByEmail("demouser@gmail.com")
                 .orElseThrow(() -> new RuntimeException("Admin not found"));
    
        if (demoAdmin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Demo admin not found");
        }
    
        String token = jwtTokenProvider.generateToken(demoAdmin.getEmail());
        RefreshToken refreshToken = refreshTokenService.createAdminRefreshToken(demoAdmin.getEmail());
    
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Demo login successful",
            "data", Map.of(
                "token", token,
                "refreshToken", refreshToken.getToken()
            )
        ));
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshTokenStr = request.get("refreshToken");

        try {
            RefreshToken refreshToken = refreshTokenService.getRefreshToken(refreshTokenStr);

            if (refreshTokenService.isTokenExpired(refreshToken)) {
                refreshTokenService.deleteRefreshToken(refreshToken);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Refresh token expired"
                ));
            }

            String newAccessToken = jwtTokenProvider.generateToken(refreshToken.getPatient().getEmail());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Access token refreshed",
                    "data", Map.of("token", newAccessToken)
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid refresh token"
            ));
        }
    }
}