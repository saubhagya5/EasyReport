package com.example.EasyReport.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class OtpService {

    private static final long OTP_VALIDITY_DURATION = 2 * 60 * 1000; // 2 minutes

    private final JavaMailSender mailSender;
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    @Value("${spring.mail.username}")
    private String fromEmail;

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        otpStore.put(email, new OtpData(otp, System.currentTimeMillis()));

        return sendOtpViaEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStore.get(email);
        if (data == null) return false;

        long now = System.currentTimeMillis();
        boolean isExpired = now - data.getTimestamp() > OTP_VALIDITY_DURATION;

        if (isExpired) {
            otpStore.remove(email);
            return false;
        }

        boolean isValid = otp.equals(data.getOtp());
        if (isValid) otpStore.remove(email);
        return isValid;
    }

    private boolean sendOtpViaEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP for EasyReport");
            helper.setText("Hello!\n" + //
                                "\n" + //
                                "Your One-Time Password (OTP) for EasyReport is:"+ otp+ "\n" + //
                                "It is valid for 2 minutes.\n" + //
                                "\n" + //
                                "Thank you,\n" + //
                                "EasyReport Team");
            mailSender.send(message);
            return true;
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            return false;
        }
    }

    private static class OtpData {
        private final String otp;
        private final long timestamp;

        public OtpData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() {
            return otp;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}