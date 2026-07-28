package com.Hotel_Management.Repository;


import jakarta.transaction.TransactionScoped;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Hotel_Management.Model.room;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


public interface roomRepository extends JpaRepository<room,Integer> {

    @Modifying
    @Transactional
    @Query("update room r set r.total=r.total-1 where roomId= :id")  // use java class fileds here
     void updateroom(Integer id);

    @Modifying
    @Transactional
    @Query("update room r set r.total=r.total+1 where roomId= :id")  // use java class fileds here
    void checkoutDone(Integer id);

}
