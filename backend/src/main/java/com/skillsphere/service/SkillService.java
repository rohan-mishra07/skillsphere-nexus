package com.skillsphere.service;

import com.skillsphere.dto.SkillDTO;
import com.skillsphere.model.Skill;
import com.skillsphere.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    @Autowired
    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @SuppressWarnings("null")
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(s -> SkillDTO.builder()
                        .id(s.getId())
                        .skillId(s.getSkillId())
                        .name(s.getName())
                        .category(s.getCategory())
                        .description(s.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public Skill saveSkill(Skill skill) {
        if (skill.getSkillId() == null && skill.getName() != null) {
            skill.setSkillId(UUID.nameUUIDFromBytes(skill.getName().getBytes()));
        }
        return skillRepository.save(skill);
    }

    public Optional<Skill> getSkillById(Long id) {
        return skillRepository.findById(id);
    }
}
