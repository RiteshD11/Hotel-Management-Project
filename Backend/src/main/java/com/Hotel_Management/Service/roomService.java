package com.Hotel_Management.Service;


import com.Hotel_Management.Model.features;
import com.Hotel_Management.Model.room;
import com.Hotel_Management.Repository.featureRepo;
import com.Hotel_Management.Repository.roomRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class roomService {

    @Autowired
    public roomRepository roomRepo;

    @Autowired
    public featureRepo featureRepo;

    public String addRoomService(room r) {


        if (r.getFeature() == null || r.getFeature().isEmpty()) {
            roomRepo.save(r);
            return "Room added without features";
        }
        List<Integer> ids = r.getFeature()
                .stream()
                .map(features::getFeatureId)
                .toList();

        List<features> featureList = featureRepo.findAllById(ids);

        r.setFeature(featureList);
        roomRepo.save(r);
        return "Room Added with room id "+r.getRoomId();
    }

    public List<room> allRoomsSer() {


        return roomRepo.findAll();
    }

    public String removeroomser(int id) {

        if (roomRepo.existsById(id)) {

            roomRepo.deleteById(id);
            return "Room with room id " + id + " deleted successfully ";

        } else {
            return "Room with id " + id + " Does Not Present";
        }
    }

    public String updateroomser(room rm) {

        if (roomRepo.existsById(rm.getRoomId())) {

            roomRepo.save(rm);

        }
            return  "done";


    }

    public room findroomser(int id) {


        return roomRepo.findById(id).orElse(new room());
    }
    public String addfeatureser(features f){

        if(featureRepo.findByFeatureName(f.getFeatureName())==null) {
            featureRepo.save(f);
            return "New Feature where added";
        }
       return "Feature already exists";
    }
}