package com.Hotel_Management;

import com.Hotel_Management.Model.User;
import com.Hotel_Management.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdmin(UserRepository userRepository) {
		return args -> {
			if (!userRepository.existsByEmail("riteshdudhbhate11@gmail.com")) {
				User admin = new User();
				admin.setUserName("Admin");
				admin.setEmail("riteshdudhbhate11@gmail.com");
				admin.setPassword(new BCryptPasswordEncoder(12).encode("1234"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Default admin user created: riteshdudhbhate11@gmail.com / 1234");
			}
		};
	}

}
