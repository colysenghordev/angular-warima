import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  jwt: string;

  loginUserData = {};

  helper = new JwtHelperService();
  accountData: any;
  authService: any;
  roles: String;

  // tslint:disable-next-line: variable-name
  constructor(private _auth: AuthService, private fb: FormBuilder, private router: Router) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnInit() {
    localStorage.clear()
  }

  loginUser() {
    this._auth.login(this.loginUserData)
      .subscribe(
        res => {
          const token = res.token;
          localStorage.setItem('token', token);
          const decodedToken = this.helper.decodeToken(token);
          console.log(decodedToken);
          localStorage.setItem('username', decodedToken.username);
          localStorage.setItem('roles', decodedToken.roles[0]);
          localStorage.setItem('expiration', decodedToken.exp);
          console.log(localStorage);
          this.newMethod();
        },
        err => console.log(err),
      );
  }

  private newMethod() {
    this.roles=localStorage.getItem("roles");
    if (this.roles =="ROLE_Super-Admin" ) {
      this.router.navigate(["/admin-général"]);
    }
    else if (this.roles == "ROLE_Partenaire") {
      this.router.navigate(["/partenaire"])
    }
  }

}
