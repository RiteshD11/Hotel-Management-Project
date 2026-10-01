package com.Hotel_Management.Controller;

import com.Hotel_Management.Model.features;
import com.Hotel_Management.Model.room;
import com.Hotel_Management.Service.roomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class RoomHandel {

    @Autowired
    public roomService roomer;

    @PostMapping("/admin/addroom")
    @PreAuthorize("hasRole('ADMIN')")
    public String addRoom(@RequestBody room r){

        return roomer.addRoomService(r);
    }

    @GetMapping("/allrooms")
    public List<room> allRooms(){
        return roomer.allRoomsSer();
    }

    @GetMapping("/admin/deleteroom/{id}")
    public String removeroom( @PathVariable  int id){
        return roomer.removeroomser(id);
    }

    @PostMapping("/admin/updateroom")
      public String updateroom(@RequestBody room rm){

        return  roomer.updateroomser(rm);

      }
      @GetMapping("/admin/findroom/{id}")
        public room findroom(@PathVariable  int id){

            return  roomer.findroomser(id);
        }

       @PostMapping("/admin/addfeature")
        public String newfeature(features fear){
            return roomer.addfeatureser(fear);
       }



}
