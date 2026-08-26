import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private baseUrl = 'http://localhost:8080/api/certifications';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getEmployeeCertifications(empId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/${empId}`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getExpiring(): Observable<any> {
    return this.http.get(`${this.baseUrl}/expiring`);
  }

  getExpired(): Observable<any> {
    return this.http.get(`${this.baseUrl}/expired`);
  }

  requestRenewal(certificationId: string, requestedBy: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/renewals/${certificationId}`,
      null,
      { params: { requestedBy } }
    );
  }

  approveRenewal(renewalId: string, newExpiry: string, approvedBy: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/renewals/${renewalId}/approve`,
      null,
      { params: { newExpiry, approvedBy } }
    );
  }

  getCompliance(empId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/compliance/${empId}`);
  }

  getReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/report`);
  }

  getAudit(certificationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${certificationId}/audit`);
  }
}
