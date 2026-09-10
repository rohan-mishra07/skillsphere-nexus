package com.skillsphere.careerservice.service;

import com.skillsphere.careerservice.dto.JobDTO;
import com.skillsphere.careerservice.entity.Job;
import com.skillsphere.careerservice.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository repository;

    public JobDTO create(JobDTO dto) {
        Job job = Job.builder()
                .title(dto.getTitle())
                .department(dto.getDepartment())
                .requiredSkills(dto.getRequiredSkills())
                .minimumExperience(dto.getMinimumExperience() != null ? dto.getMinimumExperience() : 0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return toDTO(repository.save(job));
    }

    public List<JobDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public List<JobDTO> getActiveJobs() {
        return repository.findByActiveTrue().stream().map(this::toDTO).toList();
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Job not found");
        }
        repository.deleteById(id);
    }

    private JobDTO toDTO(Job j) {
        if (j == null) return null;
        return JobDTO.builder()
                .jobId(j.getJobId())
                .title(j.getTitle())
                .department(j.getDepartment())
                .requiredSkills(j.getRequiredSkills())
                .minimumExperience(j.getMinimumExperience())
                .active(j.getActive())
                .build();
    }
}
