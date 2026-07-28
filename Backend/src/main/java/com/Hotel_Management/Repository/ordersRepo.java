package com.Hotel_Management.Repository;

import com.Hotel_Management.Model.orders;
import jakarta.transaction.Transactional;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ordersRepo extends JpaRepository<orders,Integer> {


//    @Modifying
//    @Query("delete from orders o where o.orderId")
//    orders deleteorder(Integer orderid);

    @Query(value = "SELECT DATEDIFF(check_out, check_in) FROM orders WHERE order_id = :id", nativeQuery = true)
    Integer getAmount(Integer id);
}
