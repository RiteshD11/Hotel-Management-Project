package org.springframework.http;


import com.Hotel_Management.Model.features;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class room  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer roomId;

    private String roomType;

    @Column(nullable = false)
    private String roomName;
    @Column(nullable = false)
    private BigDecimal roomRent;

    private int roomCapacity;
    private int roomSize;
    private String  roomDescription;

    @ManyToMany
    @JoinTable(
            name = "room_feature",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private List<features>featuress;


    private String imageName;
    private String imageType;

    @Lob // large object
    private byte[] imageData;

    @Column(name = "totalRooms" , nullable = false ,columnDefinition = "int default 100")
    private  int total=100;



}
