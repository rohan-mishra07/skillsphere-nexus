package com.skillsphere.repository;

import com.skillsphere.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@SuppressWarnings("null")
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmpId(UUID empId);
    void deleteByEmpId(UUID empId);
}
