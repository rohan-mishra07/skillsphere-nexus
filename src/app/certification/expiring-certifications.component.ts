import { Component, OnInit } from '@angular/core';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-expiring-certifications',
  templateUrl: './expiring-certifications.component.html'
})
export class ExpiringCertificationsComponent implements OnInit {
  certifications: any[] = [];

  constructor(private certificationService: CertificationService) {}

  ngOnInit(): void {
    this.certificationService
      .getExpiring()
      .subscribe((data: any) => {
        this.certifications = data;
      });
  }
}
