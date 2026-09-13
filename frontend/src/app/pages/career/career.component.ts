import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  plans: any[] = [];
  roles: any[] = [];
  newPlan: any = {
    empId: '11111111-1111-1111-1111-111111111111',
    employeeName: '',
    currentRole: '',
    targetRole: 'Senior Developer',
    employeeSkills: '',
    progress: 50,
    mentor: '',
    trainingPlan: ''
  };

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPlans();
  }

  loadRoles(): void {
    this.careerService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Failed to load roles:', err)
    });
  }

  loadPlans(): void {
    this.careerService.getCareerPlans().subscribe((data) => (this.plans = data));
  }

  createPlan(): void {
    if (!this.newPlan.employeeName || !this.newPlan.targetRole) return;
    this.careerService.createCareerPlan(this.newPlan).subscribe({
      next: () => {
        this.loadPlans();
        this.newPlan.employeeName = '';
        this.newPlan.currentRole = '';
        this.newPlan.employeeSkills = '';
      },
      error: (err) => console.error('Error creating plan:', err)
    });
  }

  getSkillGapBadges(gaps: string): string[] {
    if (!gaps || !gaps.trim()) return [];
    return gaps.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }
}
