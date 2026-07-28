package com.Hotel_Management.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tokenid;

    private String token;

    private  boolean revoked;
    private  boolean expired;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
