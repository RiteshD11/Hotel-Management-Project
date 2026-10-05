package com.Hotel_Management.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class emailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from:${spring.mail.username:noreply@hotelmate.com}}")
    private String fromEmail;

    public void sendEmail(String email, String subject, String s) {
        SimpleMailMessage mailMessage=new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(s);
        mailMessage.setFrom(fromEmail);
        mailSender.send(mailMessage);
    }
}
