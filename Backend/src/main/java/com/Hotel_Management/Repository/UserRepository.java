package com.Hotel_Management.Repository;

import com.Hotel_Management.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UserRepository extends JpaRepository<User,Integer> {

    public User findByEmail(String email);


    boolean existsByEmail(String email);
}
