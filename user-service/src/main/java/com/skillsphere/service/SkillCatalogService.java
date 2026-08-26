package com.skillsphere.service;

import com.skillsphere.dto.SkillDTO;
import com.skillsphere.model.Skill;
import com.skillsphere.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillCatalogService {

    private final SkillRepository skillRepository;

    @SuppressWarnings("null")
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public SkillDTO addSkill(SkillDTO dto) {
        Skill skill = Skill.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .build();
        return toDTO(skillRepository.save(skill));
    }

    @SuppressWarnings("null")
    private SkillDTO toDTO(Skill skill) {
        return SkillDTO.builder()
                .skillId(skill.getSkillId())
                .name(skill.getName())
                .category(skill.getCategory())
                .build();
    }
}
