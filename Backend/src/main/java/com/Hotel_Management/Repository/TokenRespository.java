package com.Hotel_Management.Repository;

import com.Hotel_Management.Model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRespository extends JpaRepository<Token,Integer> {

    Optional<Token> findByToken(String token);
//
////    @Query("select t from Token where t.userid =:userId and t.revoke=false and t.expiry=false")
////    List<Token> findAllValidTokenByUser(Long userId);
}
