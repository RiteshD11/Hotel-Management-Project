package com.Hotel_Management.Controller;


import com.Hotel_Management.Model.Token;
import com.Hotel_Management.Model.User;
import com.Hotel_Management.Model.userLogin;
import com.Hotel_Management.Service.UserRegistrationS;
import com.Hotel_Management.Service.emailService;
import com.Hotel_Management.Service.jwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class UserRegistration {

    @Autowired
    private UserRegistrationS userRegistrationS;
    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);



@Autowired
        public emailService emailservice;
    Map<String,String> otps=new HashMap<>();


    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Map<String,String >req){

        String email=req.get("email");

        if(userRegistrationS.findUser(email)){

            throw new RuntimeException("Email is already taken");
        }
        String otp=String.valueOf((int)(Math.random()*900000)+100000);
        otps.put(email,otp);
        emailservice.sendEmail(
                email,
                "Hotel ",
                "WEL-COME To Our Hotel\nGreatings From Ritesh.\n Your Otp is : "
                        +otp);
        return "otp Sent";
    }

    @PostMapping("/verify-otp")

    public Map<String,String> verifyOtp(@RequestBody Map<String,String> req){

        String email=req.get("email");
        String otp=req.get("otp");
        Map<String,String> response=new HashMap<>();
        if(otps.containsKey(email) && otps.get(email).equals(otp)){
            otps.remove(email);
            String token=jwtservice.generateToken(email);
            response.put("status","success");
            response.put("token",token);
            return response;
        }

        response.put("status","error");
        response.put("message","Invalid Otp");

        return response;

    }
    @PostMapping("/set-profile")
    public void setProfile(@RequestBody User user){
//        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
//
//        if(authentication==null || !authentication.isAuthenticated()){
//            throw new RuntimeException("User not authenticated");
//        }
//        String email=authentication.getName();
//        user.setEmail(email);
        Register(user);
    }


    @PostMapping("/register")
    public String Register(@RequestBody User user){

       user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("USER");
           return ("New User Added With Email " +userRegistrationS.register(user));
    }

    @PostMapping("/register-admin")

    public String registerAdmin(@RequestBody User user){
        user.setRole("ADMIN");
        user.setPassword(encoder.encode((user.getPassword())));
        return ("New Admin Added With Email " +userRegistrationS.register(user));
    }

    @Autowired
    public AuthenticationManager authManager;

    @Autowired
    private jwtService jwtservice;


    @PostMapping("/login")
    public Map<String,String> login(@RequestBody userLogin user){
        Authentication authentication=authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),user.getPassword()
                )
        );

        if (authentication.isAuthenticated()){
//            return Map.of("token",jwtservice.generateToken(user.getEmail()));
            String token=jwtservice.generateToken(user.getEmail());
            User us=userRegistrationS.singleUserR(user.getEmail());
            System.out.println("TOKEN: " +token );
            System.out.println("EMAIL: " + user.getEmail());
            System.out.println("USERNAME: " + us.getUserName());
            Token tkn=new Token();
            tkn.setToken(token);
            tkn.setUser(us);
            tkn.setExpired(false);
            tkn.setRevoked(false);
            userRegistrationS.addToken(tkn);
            return Map.of(
                    "token", token,
                    "email", user.getEmail(),
                    "userName", us.getUserName(),
                    "role",us.getRole()
            );

        }else {
            return Map.of("error","Not Authenticated");
        }
    }


    @GetMapping("/Users")

    public List<User> getUsers(){

        return userRegistrationS.getUsersR();
    }

    @PostMapping("/logout")
    public  ResponseEntity<String>  logout(HttpServletRequest request){

        String authheader=request.getHeader("Authorization");

              if(authheader!=null && authheader.startsWith("Bearer ")){

                  String jwt=authheader.substring(7);

                  Token tokenStored=userRegistrationS.findToken(jwt);

                  if(tokenStored!=null){
                      tokenStored.setRevoked(true);
                      tokenStored.setExpired(true);
                      userRegistrationS.addToken(tokenStored);
                  }
                  return ResponseEntity.ok("Logout is Successfull");

              }
              return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).body("Log out is unsuccessfull");

    }
}
