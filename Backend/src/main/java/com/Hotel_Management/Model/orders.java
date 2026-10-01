package com.Hotel_Management.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private  User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private room roomm;

    @Column(nullable = false ,columnDefinition = "DATE DEFAULT (CURRENT_DATE)")
    private Date checkIn;

    private  Date checkOut;

    // true if status is active  , means customer didn't made checout
    @Column(nullable = false)
    private boolean status=false;

    public int roomNo;


}
