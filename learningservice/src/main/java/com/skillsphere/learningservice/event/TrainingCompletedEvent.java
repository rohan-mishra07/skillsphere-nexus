package com.skillsphere.learningservice.event;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingCompletedEvent {
    private UUID empId;
    private String courseSkill;
    private String completedAt;
}
