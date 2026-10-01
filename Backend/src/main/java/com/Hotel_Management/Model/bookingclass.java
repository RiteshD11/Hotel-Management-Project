package com.Hotel_Management.Model;

import lombok.Data;

import java.util.Date;

@Data
public class bookingclass {

    private int roomId;
    private Date checkin;
    private  Date checkout;

}
