package com.Hotel_Management.Controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Base {

    @GetMapping("/home")
    public String home(){
        return "Into The Home Page";
    }
}
