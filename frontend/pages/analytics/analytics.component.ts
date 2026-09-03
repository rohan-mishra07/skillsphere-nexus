import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  analytics: any;

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getAnalytics().subscribe((data) => (this.analytics = data));
  }
}
