import { Component, OnInit } from '@angular/core';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html'
})
export class CertificationListComponent implements OnInit {
  certifications: any[] = [];
  empId: string = 'PUT-EMPLOYEE-UUID-HERE';

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
      .requestRenewal(certId, 'HR')
      .subscribe(() => {
        alert('Renewal requested successfully');
        this.loadCertifications();
      });
  }
}
