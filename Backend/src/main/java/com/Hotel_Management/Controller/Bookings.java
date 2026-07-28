package com.Hotel_Management.Controller;

import com.Hotel_Management.Model.*;
import com.Hotel_Management.Repository.UserRepository;
import com.Hotel_Management.Repository.roomRepository;
import com.Hotel_Management.Service.UserRegistrationS;
import com.Hotel_Management.Service.emailService;
import com.Hotel_Management.Service.orderSer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController

@RequestMapping("/bookings")
public class Bookings {

    @Autowired
    private orderSer orderser;
    @Autowired
    public UserRepository userRepository;

    @Autowired
    public emailService emailService;
    @PostMapping("/bookroom")
    public  String checkInroom(@RequestBody bookingclass bkclass){



        // I want to write here the code to send the mail


       return orderser.bookroom(bkclass);
    }
    @PostMapping("/checkoutroom/{orderId}")
    public  void checkoutclient(@PathVariable Integer orderId){ // i think here i should get some of data like which room is it wants to checkout

        orderser.checkOutTheRoom(orderId);
    }

    @PostMapping("/updatebooking")
    public void  editbooking( @RequestBody bookingclass bkls){

//             orderSer

    }


}
