import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak;
  private isInitialized = false;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8081',
      realm: 'skillsphere',
      clientId: 'skillsphere-frontend'
    });
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false
      });
      this.isInitialized = true;
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] || '';
  }

  getRoles(): string[] {
    const realmAccess = this.keycloak.tokenParsed?.['realm_access'];
    return realmAccess?.roles || [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role) || roles.includes(`ROLE_${role.toUpperCase()}`);
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
