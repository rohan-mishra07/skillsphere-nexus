-- Seed file for Milestone 1: Employee Skill Management

INSERT INTO employees (emp_id, name, role, department)
VALUES (gen_random_uuid(), 'John Smith', 'DEVELOPER', 'Engineering');

INSERT INTO skills (skill_id, name, category) VALUES
(gen_random_uuid(), 'Java', 'TECHNICAL'),
(gen_random_uuid(), 'Spring Boot', 'TECHNICAL'),
(gen_random_uuid(), 'Angular', 'TECHNICAL');
