import { Component, OnInit } from '@angular/core';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html'
})
export class CertificationListComponent implements OnInit {
  certifications: any[] = [];
  empId: string = '550e8400-e29b-41d4-a716-446655440000';
  selectedAuditLogs: any[] = [];
  selectedCertName: string = '';

  constructor(private certificationService: CertificationService) {}

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    this.certificationService
      .getEmployeeCertifications(this.empId)
      .subscribe((data: any) => {
        this.certifications = data;
      });
  }

  onRenew(certId: string): void {
    this.certificationService
      .requestRenewal(certId, 'Rohan Mishra')
      .subscribe(() => {
        alert('Renewal requested successfully');
        this.loadCertifications();
      });
  }

  viewAudit(cert: any): void {
    this.selectedCertName = cert.name;
    this.certificationService
      .getAudit(cert.certId)
      .subscribe((logs: any) => {
        this.selectedAuditLogs = logs;
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'VALID': return 'badge-valid';
      case 'EXPIRED': return 'badge-expired';
      case 'PENDING_RENEWAL': return 'badge-pending';
      default: return '';
    }
  }
}
