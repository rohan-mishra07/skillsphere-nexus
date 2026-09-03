import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getJobs().subscribe((data) => (this.jobs = data));
  }
}
