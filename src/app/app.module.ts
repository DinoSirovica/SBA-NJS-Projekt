import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {UserLoginComponent} from './components/user-login/user-login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserSignUpComponent} from './components/user-sign-up/user-sign-up.component';
import {AccountComponent} from './components/account/account.component';
import {CardComponent} from './components/card/card.component';
import {AuthGuard} from "./services/auth/auth.guard";
import {SubstringPipe} from './pipes/substring.pipe';
import {MonthNumberPipe} from './pipes/month-number.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NewTransactionComponent} from './components/new-transaction/new-transaction.component';
import {TransactionComponent} from './components/transaction/transaction.component';
import {UsersComponent} from './components/users/users.component';
import {ProfileComponent} from './components/profile/profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'register', component: UserSignUpComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'card', component: CardComponent, canActivate: [AuthGuard]},
  {path: 'transfer/:accountId', component: NewTransactionComponent, canActivate: [AuthGuard]},
  {path: 'transactions', component: TransactionComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserLoginComponent,
    UserSignUpComponent,
    AccountComponent,
    CardComponent,
    SubstringPipe,
    MonthNumberPipe,
    NewTransactionComponent,
    TransactionComponent,
    UsersComponent,
    ProfileComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
