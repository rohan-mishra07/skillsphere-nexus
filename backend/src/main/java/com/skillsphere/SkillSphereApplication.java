package com.skillsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SkillSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillSphereApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("  SkillSphere Platform Backend Started Successfully!   ");
        System.out.println("  REST APIs available at: http://localhost:8080/api    ");
        System.out.println("  H2 Console available at: http://localhost:8080/h2-console ");
        System.out.println("=======================================================\n");
    }
}
