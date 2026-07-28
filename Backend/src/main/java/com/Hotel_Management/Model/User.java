package com.Hotel_Management.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.processing.Pattern;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data

public class User {

           @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
           private String userName;

           @Column(unique = true)
           private String email;
           private String password;

           @Column(name = "role" , columnDefinition = "varchar(25) default 'USER'")
           private String role="USER";

           private String contact;
           private String adharNumber;

           @Enumerated(EnumType.STRING)
           private Gender gender;



}

 enum Gender{
    MALE,
    FEMALE,
    OTHER
}