package com.skillsphere.service;

import com.skillsphere.dto.EmployeeDto;
import com.skillsphere.dto.SkillCompetencyDto;
import com.skillsphere.model.Employee;
import com.skillsphere.model.SkillCompetency;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.repository.SkillCompetencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final SkillCompetencyRepository skillCompetencyRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, SkillCompetencyRepository skillCompetencyRepository) {
        this.employeeRepository = employeeRepository;
        this.skillCompetencyRepository = skillCompetencyRepository;
    }

    @SuppressWarnings("null")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @SuppressWarnings("null")
    public Optional<Employee> getEmployeeByEmpId(UUID empId) {
        return employeeRepository.findByEmpId(empId);
    }

    @SuppressWarnings("null")
    public Employee saveEmployee(Employee employee) {
        if (employee.getEmpId() == null) {
            employee.setEmpId(UUID.randomUUID());
        }
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(UUID empId) {
        employeeRepository.deleteByEmpId(empId);
    }

    @SuppressWarnings("null")
    public EmployeeDto getEmployeeProfile(UUID empId) {
        Employee employee = employeeRepository.findByEmpId(empId)
                .orElse(Employee.builder()
                        .empId(empId)
                        .name("Employee " + empId.toString().substring(0, 5))
                        .role(Employee.Role.DEVELOPER)
                        .department("Engineering")
                        .build());

        List<SkillCompetency> competencies = skillCompetencyRepository.findByEmployeeEmpId(empId);

        List<SkillCompetencyDto> skillDtos = competencies.stream()
                .map(c -> SkillCompetencyDto.builder()
                        .id(c.getId())
                        .skillId(c.getSkillId())
                        .skillName(c.getSkillName())
                        .category(c.getCategory())
                        .currentProficiency(c.getCurrentProficiency())
                        .targetProficiency(c.getTargetProficiency())
                        .status(c.getCurrentProficiency() != null && c.getTargetProficiency() != null && c.getCurrentProficiency() >= c.getTargetProficiency() ? "PROFICIENT" : "GAP")
                        .build())
                .collect(Collectors.toList());

        return EmployeeDto.builder()
                .empId(employee.getEmpId())
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole() != null ? employee.getRole().name() : "DEVELOPER")
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .skills(skillDtos)
                .build();
    }
}
