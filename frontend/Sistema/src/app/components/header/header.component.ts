import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userData: any = null;

  constructor(public authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    // Carregar dados do usuário quando o componente for inicializado
    this.loadUserData();
  }

  loadUserData(): void {
    if (this.authService.isLoggedIn()) {
      this.userData = this.authService.getUserData();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}