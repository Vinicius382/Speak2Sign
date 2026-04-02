package com.speak2sign;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Speak2SignApplication {

	public static void main(String[] args) {
		SpringApplication.run(Speak2SignApplication.class, args);
	}

}
