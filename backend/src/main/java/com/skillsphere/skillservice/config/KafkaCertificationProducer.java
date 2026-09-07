package com.skillsphere.skillservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaCertificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendRenewalEvent(String message) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                kafkaTemplate.send("certification-renewal", message);
            } catch (Exception e) {
                System.err.println("[Kafka] Producer notification log: " + e.getMessage());
            }
        });
    }
}
