package com.Hotel_Management.Service;

import com.Hotel_Management.Model.*;
import com.Hotel_Management.Repository.UserRepository;
import com.Hotel_Management.Repository.ordersRepo;
import com.Hotel_Management.Repository.roomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class orderSer {
    @Autowired
    public emailService emailService;
    @Autowired
    private ordersRepo ordersrepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private roomRepository roomRepository;

    public  String bookroom(bookingclass bkclass){


        orders order=new orders();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        if(!roomRepository.existsById(bkclass.getRoomId())){
            return new RuntimeException("No Room Found").toString();
        }
        if(roomRepository.findById(bkclass.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found")).getTotal()<=0){
            return new RuntimeException(" Room is not available , Book different room").toString();
        }
        UserPrinciple userPrinciple=(UserPrinciple) auth.getPrincipal();

        Integer customerId=userPrinciple.getUserId();

        order.setUser(userRepository.findById(customerId).orElseThrow(() -> new RuntimeException("User not found")));
        order.setRoomm(roomRepository.findById(bkclass.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found")));
        order.setCheckIn(new java.sql.Date(bkclass.getCheckin().getTime()));
        order.setCheckOut(new java.sql.Date(bkclass.getCheckout().getTime()));


//        Authentication auth=SecurityContextHolder.getContext().getAuthentication();
//        UserPrinciple userPrinciple= (UserPrinciple) auth.getPrincipal();
//        Integer customerId=userPrinciple.getUserId();

        User user=userRepository.findById(customerId).orElseThrow(() ->
                new RuntimeException("Order  not found"));

        room rm=roomRepository.getById(bkclass.getRoomId());



        Random rand = new Random();

        int roomNumber= rand.nextInt(101); // 0 to 100


        order.setRoomNo(roomNumber);
        int orderId= ordersrepo.save(order).getOrderId();
        roomRepository.updateroom(bkclass.getRoomId());
        String sub="Booking Successfull..";
        String email=user.getEmail();
        String body="Dear "+user.getUserName()+
                ",\n"+"\nYour Room is booked successfully\n\n" +
                "Room Details are : \n\n" +
                "Room Number : "+roomNumber+"\n"+
                "Room Type : "+rm.getRoomType()+"\n"+
                "Room Description : "+rm.getRoomDescription()+"\n"+
                "Check In Date : "+bkclass.getCheckin()+"\n"+
                "\n\nThank You \n";
        emailService.sendEmail(email,sub,body);

        return "Order Placed Successfully\nYour Order Id is "+orderId;
    }

    public void checkOutTheRoom(int orderId){

        Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        UserPrinciple userPrinciple= (UserPrinciple) auth.getPrincipal();

        Integer customerId=userPrinciple.getUserId();

        orders order=ordersrepo.findById(orderId).orElseThrow(()->new NoSuchElementException("Order Not found"));

        int customerid=order.getUser().getUserId();


        if(userRepository.existsById(customerId) && customerId==customerid ){
            int roomNumber=order.getRoomNo();
            int roomId=order.getRoomm().getRoomId();

            // we has to generate the bill here


            double bill=order.getRoomm().getRoomRent();

                    bill*=(double) ordersrepo.getAmount(orderId);
            // send mail
            String sub="Checkout Done";
            String body="Dear "+order.getUser().getUserName()+" ,\n"+
                        "Thank for booking room \n\n"+
                        "Your Bill price is : "+bill+"\n\n"+
                        "Visite Again \n";
            String email=order.getUser().getEmail();
            emailService.sendEmail(email,sub,body);
            ordersrepo.deleteById(orderId);
            roomRepository.checkoutDone(roomId);

        }else{
             new UsernameNotFoundException("Customer Id is not correct").toString();
        }
    }
    public void deletebooking(@PathVariable int orderid) {

        // here i want to check wheather the user is existing , or I am validationg the user and the room

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrinciple userPrinciple = (UserPrinciple) auth.getPrincipal();
        Integer customerId = userPrinciple.getUserId();

        if (userRepository.existsById(customerId)
                && ordersrepo.findById(orderid).orElseThrow(() ->
                new RuntimeException("Order id " + orderid + " not found")).isStatus()) {

            // now room check
            orders order = ordersrepo.findById(orderid).orElseThrow(() ->
                    new RuntimeException("Order id " + orderid + " not found"));
            // here i am thinking th write one mail to displaying the customer that your order is cancelled

            // for to delete the orde i should make the status false;
//            ordersrepo.deleteorder(orderid);

//            return "Your Order is cancelled successfully...";


//            Integer roomid=
        } else {
            new UsernameNotFoundException("User not found").toString();
        }
    }

}
