// CreateTestReportInput.java
package com.example.EasyReport.dto;

public class CreateTestReportInput {
    private String patientEmail;
    private String patientPhone;
    private String type;
    private String date;  // use String if you handle LocalDate parsing manually
    private String status;

    // Getters and setters
    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}