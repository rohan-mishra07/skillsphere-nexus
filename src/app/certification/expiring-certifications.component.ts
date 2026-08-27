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
    this.loadExpiring();
  }

  loadExpiring(): void {
    this.certificationService
      .getExpiring()
      .subscribe((data: any) => {
        this.certifications = data;
      });
  }

  onRequestRenewal(certId: string): void {
    this.certificationService
      .requestRenewal(certId, 'Rohan Mishra')
      .subscribe(() => {
        alert('Renewal requested for expiring certification');
        this.loadExpiring();
      });
  }
}
