package com.Hotel_Management.Service;

import com.Hotel_Management.Model.Token;
import com.Hotel_Management.Model.User;
import com.Hotel_Management.Repository.TokenRespository;
import com.Hotel_Management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserRegistrationS {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private emailService emailService;

    public String register(User user){

        user.setRole("USER");
        userRepository.save(user);


        // mail
        String sub="Registration Successfull..";
        String email=user.getEmail();
        String body="WEL-COME\nDear User,\nYou are suceessfully register to hotel\n";
        emailService.sendEmail(email,sub,body);

        return user.getEmail();
    }

    public List<User> getUsersR() {
        return userRepository.findAll();
    }
    public User singleUserR(String email){
        return userRepository.findByEmail(email);
    }
    @Autowired
    private TokenRespository tokenRespository;

    public  void addToken(Token tkn){
        tokenRespository.save(tkn);
    }

    public  Token findToken(String token){

        return tokenRespository.findByToken(token).orElse(null);
    }
    public boolean findUser(String email){

        return userRepository.existsByEmail(email);
    }
}
