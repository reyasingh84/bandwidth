import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service'; 
import { Router } from '@angular/router';
import { isValidAuthToken } from '../../../utils/auth-token';
import { InputPasswordModule } from 'primeng/inputpassword';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { User } from '@primeicons/angular/user';

@Component({
  imports: [ReactiveFormsModule, FormsModule, InputPasswordModule, InputTextModule, ButtonModule],
  selector: 'bw-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
  })

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token && isValidAuthToken(token)) {
      this.router.navigate(['']);
    }else{
      localStorage.clear();
    }
  }

  onFormSubmit(){
    const formVal = this.loginForm.value
    const email = formVal.email;
    const password = formVal.password;

    const finalEmail =  email ? email : "";
    const finalPassword = password ? password : "";

    if (!finalEmail || !finalPassword){
      return;
    }

    this.authService.login(finalEmail, finalPassword).subscribe({
      next: (res)=> {
        localStorage.setItem("token", res?.response?.access_token);
        const user: User = res?.response?.user;
        localStorage.setItem('userDetails', JSON.stringify(user));
        this.router.navigate([""]),
        this.messageService.add({
          summary: "Login Success!",
          detail: "Welcome to BandWidth!",
          severity: "success"
        })
      },
      error: (err)=> {
        console.log(err);
        this.messageService.add({
          severity: "error",
          summary: "Login Failed!",
          detail: "Please check your credentials!"
        })
      },
      complete: ()=> {console.log("completed")}
    })
  }
}
