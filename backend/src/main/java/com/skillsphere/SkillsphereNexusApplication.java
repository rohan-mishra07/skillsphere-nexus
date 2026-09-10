package com.skillsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.skillsphere", exclude = { RedisRepositoriesAutoConfiguration.class })
@EnableJpaRepositories(basePackages = {
    "com.skillsphere.repository",
    "com.skillsphere.careerservice.repository",
    "com.skillsphere.learningservice.repository",
    "com.skillsphere.skillservice.repository"
})
@EntityScan(basePackages = {
    "com.skillsphere.model",
    "com.skillsphere.careerservice.entity",
    "com.skillsphere.learningservice.entity",
    "com.skillsphere.skillservice.entity"
})
public class SkillsphereNexusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillsphereNexusApplication.class, args);
    }
}
