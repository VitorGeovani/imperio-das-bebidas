import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;
  currentYear: number = new Date().getFullYear(); // Adicionando o ano atual

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.errorMessage = 'Por favor, informe email e senha.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro de login:', error);
        this.isLoading = false;
        this.errorMessage = 'Email ou senha incorretos. Por favor, tente novamente.';
      }
    });
  }
}