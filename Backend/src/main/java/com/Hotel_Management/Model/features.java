package com.Hotel_Management.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class features {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer featureId;
    private String featureName;

}
