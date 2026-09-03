import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  plans: any[] = [];

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.careerService.getCareerPlans().subscribe((data) => (this.plans = data));
  }
}
