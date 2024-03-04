import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router si aún no está importado

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient, private router: Router) {} // Agrega Router en el constructor si aún no está

  signIn(email: string, password: string): void {
    const userData = { email, password };

    this.http.post<any>('/login', userData)
      .subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          if (response && response.message === 'Autenticación exitosa') {
            // Redirigir al usuario a la página de bienvenida después de una autenticación exitosa
            switch (response.role) {
              case 'Admin':
                this.router.navigate(['/admin']); // Cambia '/admin' según tu ruta de administrador
                break;
              case 'Workers':
                this.router.navigate(['/workers']); // Cambia '/workers' según tu ruta de trabajadores
                break;
              case 'Users':
                this.router.navigate(['/users']); // Cambia '/users' según tu ruta de usuarios
                break;
              default:
                this.router.navigate(['/']); // Redirige a la página predeterminada
                break;
            }
          } else {
            alert('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
          }
        },
        error => {
          console.error('Error al enviar datos al servidor:', error);
        }
      );
  }
}
