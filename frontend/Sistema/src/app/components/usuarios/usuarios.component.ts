import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm: Usuario = { id: 0, nome: '', email: '', senha: '' };
  isEditing: boolean = false;
  formError: string = '';
  isLoading: boolean = false;
  showForm: boolean = false;
  hidePassword: boolean = true;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.formError = '';
    if (!this.usuarioForm.nome || !this.usuarioForm.email || (!this.isEditing && !this.usuarioForm.senha)) {
      this.formError = 'Por favor, preencha todos os campos.';
      return;
    }

    if (!this.validateEmail(this.usuarioForm.email)) {
      this.formError = 'Email inválido.';
      return;
    }

    this.isLoading = true;
    if (this.isEditing) {
      this.usuarioService.updateUsuario(this.usuarioForm.id, this.usuarioForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
          this.formError = 'Erro ao atualizar usuário.';
          this.isLoading = false;
        }
      });
    } else {
      this.usuarioService.createUsuario(this.usuarioForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          this.formError = 'Erro ao criar usuário.';
          this.isLoading = false;
        }
      });
    }
  }

  editUsuario(usuario: Usuario): void {
    this.usuarioForm = {...usuario, senha: ''};
    this.isEditing = true;
    this.showForm = true;
  }

  deleteUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.isLoading = true;
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.usuarioForm = { id: 0, nome: '', email: '', senha: '' };
    this.isEditing = false;
    this.formError = '';
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }
}