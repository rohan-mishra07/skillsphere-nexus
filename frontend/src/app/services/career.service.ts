import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CareerService {
  private baseUrl = 'http://localhost:8080/api/career';

  constructor(private http: HttpClient) {}

  getIntegratedCareerData(empId: string, targetRole: string = 'Senior Developer'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/integration/employee/${empId}?targetRole=${encodeURIComponent(targetRole)}`);
  }

  getCareerPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plans`);
  }

  createCareerPlan(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/plans`, data);
  }

  updateCareerPlan(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/plans/${id}`, data);
  }

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jobs/active`);
  }

  createJob(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jobs`, data);
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`);
  }
}
