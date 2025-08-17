package com.sai.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SaiBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaiBackendApplication.class, args);
	}

}
