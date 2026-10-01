package com.Hotel_Management.Repository;

import com.Hotel_Management.Model.features;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface featureRepo extends JpaRepository<features,Integer> {

    List<features> findByFeatureName(String featureName);
}
