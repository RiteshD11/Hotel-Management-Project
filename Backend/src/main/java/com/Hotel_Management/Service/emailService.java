package com.Hotel_Management.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class emailService {


    @Autowired
    private JavaMailSender mailSender;
    public void sendEmail(String email, String subject, String s) {
        SimpleMailMessage mailMessage=new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(s);
        mailMessage.setFrom("youarehackked@gmail.com");
        mailSender.send(mailMessage);
    }
}
