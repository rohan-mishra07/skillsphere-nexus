package com.skillsphere.service;

import com.skillsphere.dto.SkillCompetencyDto;
import com.skillsphere.model.SkillCompetency;
import com.skillsphere.repository.SkillCompetencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillCompetencyService {

    private final SkillCompetencyRepository skillCompetencyRepository;

    @Autowired
    public SkillCompetencyService(SkillCompetencyRepository skillCompetencyRepository) {
        this.skillCompetencyRepository = skillCompetencyRepository;
    }

    @SuppressWarnings("null")
    public List<SkillCompetency> getAllSkillCompetencies() {
        return skillCompetencyRepository.findAll();
    }

    @SuppressWarnings("null")
    public List<SkillCompetencyDto> getCompetenciesByEmployeeId(Long employeeId) {
        return skillCompetencyRepository.findByEmployeeId(employeeId).stream()
                .map(sc -> SkillCompetencyDto.builder()
                        .id(sc.getId())
                        .skillId(sc.getSkillId())
                        .skillName(sc.getSkillName())
                        .category(sc.getCategory())
                        .currentProficiency(sc.getCurrentProficiency())
                        .targetProficiency(sc.getTargetProficiency())
                        .status(sc.getCurrentProficiency() != null && sc.getTargetProficiency() != null && sc.getCurrentProficiency() >= sc.getTargetProficiency() ? "PROFICIENT" : "GAP")
                        .build())
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public SkillCompetency saveSkillCompetency(SkillCompetency skillCompetency) {
        return skillCompetencyRepository.save(skillCompetency);
    }
}
