import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CareerService } from '../../services/career.service';

interface SkillMetric {
  name: string;
  category: string;
  proficiency: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = 'Rohan Mishra';
  targetRole = 'Senior Full-Stack Architect';
  integratedData: any = null;
  loading = true;

  skillMetrics: SkillMetric[] = [
    { name: 'Spring Boot 3 & OAuth2', category: 'Backend Architecture', proficiency: 92, status: 'EXPERT' },
    { name: 'Keycloak IAM & Security Filters', category: 'Security & Auth', proficiency: 88, status: 'PROFICIENT' },
    { name: 'Angular 17+ Standalone Architecture', category: 'Frontend Web', proficiency: 85, status: 'PROFICIENT' },
    { name: 'PostgreSQL & JPA Performance Tuning', category: 'Data Management', proficiency: 90, status: 'EXPERT' },
    { name: 'Microservices Integration & Kafka', category: 'Cloud & Infrastructure', proficiency: 78, status: 'ADVANCING' }
  ];

  analyticsSummary = {
    totalSkillsManaged: 24,
    learningModulesCompleted: 18,
    certificationsEarned: 6,
    careerMilestoneProgress: 86
  };

  constructor(
    public authService: AuthService,
    private careerService: CareerService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername() || 'Rohan Mishra';
    }
    this.fetchIntegratedData();
  }

  fetchIntegratedData(): void {
    const mockEmpId = 'e1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c';
    this.careerService.getIntegratedCareerData(mockEmpId, this.targetRole).subscribe({
      next: (data) => {
        this.integratedData = data;
        this.loading = false;
      },
      error: (err) => {
        console.warn('Backend connection initializing, rendering integrated view:', err);
        this.loading = false;
      }
    });
  }

  getSkillColor(proficiency: number): string {
    if (proficiency >= 90) return 'linear-gradient(90deg, #10b981, #059669)';
    if (proficiency >= 80) return 'linear-gradient(90deg, #6366f1, #4f46e5)';
    if (proficiency >= 70) return 'linear-gradient(90deg, #3b82f6, #2563eb)';
    return 'linear-gradient(90deg, #f59e0b, #d97706)';
  }
}
