package com.skillsphere.skillservice.config;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaCertificationConsumer {

    @KafkaListener(topics = "certification-renewal", groupId = "certification-service")
    public void consume(String message) {
        System.out.println("RENEWAL EVENT RECEIVED: " + message);
    }
}
