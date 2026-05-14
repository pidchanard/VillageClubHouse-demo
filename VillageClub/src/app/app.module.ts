import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // ✅ ตรวจสอบว่ามี RouterModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginUserComponent } from './User/pages/login-user/login-user.component';
import { HeaderUserComponent } from './User/components/header-user/header-user.component';
import { HomeComponent } from './User/pages/home/home.component';
import { RegisterUserComponent } from './User/pages/register-user/register-user.component';
import { EmployeeManageComponent } from './Admin/pages/employee-manage/employee-manage.component';
import { FacilityComponent } from './Admin/pages/facility/facility.component';
import { ReservationComponent } from './User/pages/reservation/reservation.component';
import { StatusComponent } from './User/pages/status/status.component';
import { AdminhomeComponent } from './Admin/pages/adminhome/adminhome.component';
import { AdminsidebarComponent } from './Admin/components/adminsidebar/adminsidebar.component';
import { BooknowComponent } from './User/components/booknow/booknow.component';
import { DropdownComponent } from './User/components/dropdown/dropdown.component';
import { FooterComponent } from './User/components/footer/footer.component';

// คอมโพเนนต์ที่อยู่ในไฟล์ที่สอง
import { DashboardComponent } from './staff/page/dashboard/dashboard.component';
import { EditUserComponent } from './staff/page/edit-user/edit-user.component';
import { StaffSidebarComponent } from './staff/components/staff-sidebar/staff-sidebar.component';
import { HistoryReservationComponent } from './User/pages/history-reservation/history-reservation.component';

// คอมโพเนนต์ที่อยู่ในไฟล์ที่หนึ่ง
import { EmpModalComponent } from './Admin/components/emp-modal/emp-modal.component';
import { EmpEditModalComponent } from './Admin/components/emp-edit-modal/emp-edit-modal.component';
import { MockApiInterceptor } from './Service/mock-api.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    HeaderUserComponent,
    HomeComponent,
    RegisterUserComponent,
    EmployeeManageComponent,
    FacilityComponent,
    ReservationComponent,
    StatusComponent,
    AdminhomeComponent,
    AdminsidebarComponent,
    BooknowComponent,
    DropdownComponent,
    FooterComponent,
    DashboardComponent,
    EditUserComponent,
    StaffSidebarComponent,
    HistoryReservationComponent,
    
    EmpModalComponent,
    EmpEditModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
