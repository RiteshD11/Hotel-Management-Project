package com.Hotel_Management.Service;

import com.Hotel_Management.Model.User;
import com.Hotel_Management.Model.UserPrinciple;
import com.Hotel_Management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            System.out.println("User Not Found: " + email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new UserPrinciple(user);
    }
}
