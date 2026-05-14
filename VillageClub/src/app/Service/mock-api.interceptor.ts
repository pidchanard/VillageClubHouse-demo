import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private readonly storageKey = 'village-club-mock-data';

  private facilities = [
    {
      fac_ID: 1,
      fac_Name: 'สนามฟุตบอล',
      fac_Description: 'สนามฟุตบอลหญ้าเทียมสำหรับทีมเล็กและทีมใหญ่',
      fac_Capacity: 22,
      fac_Used: 8,
      fac_Empty: 14,
      fac_Status: 'Active',
      fac_price: 1200,
      fac_img: 'สนามฟุตบอล.webp'
    },
    {
      fac_ID: 2,
      fac_Name: 'สระว่ายน้ำ',
      fac_Description: 'สระว่ายน้ำระบบเกลือพร้อมพื้นที่พักผ่อน',
      fac_Capacity: 30,
      fac_Used: 12,
      fac_Empty: 18,
      fac_Status: 'Active',
      fac_price: 500,
      fac_img: 'สระว่ายน้ำ.webp'
    },
    {
      fac_ID: 3,
      fac_Name: 'สนามแบดมินตัน',
      fac_Description: 'สนามแบดมินตันในร่ม พื้นมาตรฐาน',
      fac_Capacity: 8,
      fac_Used: 4,
      fac_Empty: 4,
      fac_Status: 'Active',
      fac_price: 300,
      fac_img: 'สนามแบต.webp'
    },
    {
      fac_ID: 4,
      fac_Name: 'ห้องจัดเลี้ยง',
      fac_Description: 'ห้องจัดเลี้ยงสำหรับประชุมและกิจกรรมส่วนตัว',
      fac_Capacity: 80,
      fac_Used: 20,
      fac_Empty: 60,
      fac_Status: 'Inactive',
      fac_price: 2500,
      fac_img: 'ห้องจัดเลี้ยง.webp'
    }
  ];

  private timetables: Record<number, any[]> = {
    1: [
      { slot_ID: 101, startTime: '08:00:00', endTime: '10:00:00', label: '08:00 - 10:00', isAvailable: true },
      { slot_ID: 102, startTime: '10:00:00', endTime: '12:00:00', label: '10:00 - 12:00', isAvailable: true },
      { slot_ID: 103, startTime: '18:00:00', endTime: '20:00:00', label: '18:00 - 20:00', isAvailable: false }
    ],
    2: [
      { slot_ID: 201, startTime: '09:00:00', endTime: '11:00:00', label: '09:00 - 11:00', isAvailable: true },
      { slot_ID: 202, startTime: '13:00:00', endTime: '15:00:00', label: '13:00 - 15:00', isAvailable: true }
    ],
    3: [
      { slot_ID: 301, startTime: '10:00:00', endTime: '11:00:00', label: '10:00 - 11:00', isAvailable: true },
      { slot_ID: 302, startTime: '16:00:00', endTime: '17:00:00', label: '16:00 - 17:00', isAvailable: true }
    ],
    4: [
      { slot_ID: 401, startTime: '09:00:00', endTime: '12:00:00', label: '09:00 - 12:00', isAvailable: false }
    ]
  };

  private employees = [
    {
      id: 1,
      idCard: '1101700000001',
      firstName: 'Somchai',
      lastName: 'Jaiyen',
      email: 'staff@club.test',
      phone: '0812345678',
      password: '123456',
      position: 'Reception',
      address: 'Bangkok',
      birthDate: '1995-02-14',
      status: 'active'
    },
    {
      id: 2,
      idCard: '1101700000002',
      firstName: 'Malee',
      lastName: 'Sukjai',
      email: 'malee@club.test',
      phone: '0898765432',
      password: '123456',
      position: 'Reception',
      address: 'Nonthaburi',
      birthDate: '1997-07-08',
      status: 'active'
    }
  ];

  private currentUser = {
    id: 10,
    idCard: '1101700000010',
    firstName: 'Demo',
    lastName: 'Member',
    birthDate: '1998-05-20T00:00:00',
    email: 'user@club.test',
    phone: '0800000000',
    role: 'User',
    password: '1234',
    position: '',
    address: 'Bangkok',
    status: 'active'
  };

  private reservations = [
    {
      id: 1,
      r_id: 1001,
      fac_Name: 'สนามฟุตบอล',
      firstName: 'Demo',
      lastName: 'Member',
      r_Date: '2026-05-16T00:00:00',
      r_Time: '10:00 - 12:00',
      r_Status: 'Pending',
      pay_Amount: 1200,
      pay_Status: 'Pending'
    },
    {
      id: 2,
      r_id: 1002,
      fac_Name: 'สระว่ายน้ำ',
      firstName: 'Demo',
      lastName: 'Member',
      r_Date: '2026-05-18T00:00:00',
      r_Time: '13:00 - 15:00',
      r_Status: 'Verified',
      pay_Amount: 500,
      pay_Status: 'Verified'
    }
  ];

  private payments = [
    {
      pay_ID: 501,
      fac_Name: 'สนามฟุตบอล',
      firstName: 'Demo',
      lastName: 'Member',
      pay_Date: '2026-05-14T10:20:00',
      pay_Amount: 1200,
      pay_Method: 'QR PromptPay',
      pay_Status: 'Pending'
    },
    {
      pay_ID: 502,
      fac_Name: 'สระว่ายน้ำ',
      firstName: 'Demo',
      lastName: 'Member',
      pay_Date: '2026-05-13T15:45:00',
      pay_Amount: 500,
      pay_Method: 'Cash',
      pay_Status: 'Verified'
    }
  ];

  constructor() {
    this.loadFromStorage();
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isMockApi(request.url)) {
      return next.handle(request);
    }

    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();
    const body = request.body as any;

    if (request.method === 'POST' && path.endsWith('/api/user/login')) {
      const role = this.getRoleFromEmail(body?.email);
      return this.response({ token: this.createToken(role), role });
    }

    if (request.method === 'POST' && path.endsWith('/api/user/register')) {
      this.currentUser = { ...this.currentUser, ...body, role: 'User', status: 'active' };
      this.persistToStorage();
      return this.response({ message: 'Mock registration success', user: this.currentUser });
    }

    if (request.method === 'GET' && path.endsWith('/api/user/getmy')) {
      return this.response(this.currentUser);
    }

    if (request.method === 'PUT' && path.endsWith('/api/user/useredit')) {
      this.currentUser = {
        ...this.currentUser,
        firstName: body?.FirstName ?? this.currentUser.firstName,
        lastName: body?.LastName ?? this.currentUser.lastName,
        phone: body?.Phone ?? this.currentUser.phone,
        email: body?.Email ?? this.currentUser.email,
        birthDate: body?.BirthDate ?? this.currentUser.birthDate,
        password: body?.Password ?? this.currentUser.password
      };
      this.persistToStorage();
      return this.response({ message: 'Mock profile updated', user: this.currentUser });
    }

    if (request.method === 'GET' && path.endsWith('/api/facilities/getfacilities')) {
      return this.response(this.facilities);
    }

    const timetableMatch = path.match(/\/api\/facilities\/gettimetable\/(\d+)/);
    if (request.method === 'GET' && timetableMatch) {
      const facilityId = Number(timetableMatch[1]);
      return this.response(this.timetables[facilityId] ?? []);
    }

    if (request.method === 'PUT' && path.includes('/api/facilities/editfacility/')) {
      const id = this.getLastNumber(path);
      const updated = { ...body, fac_ID: id };
      this.facilities = this.facilities.map(facility => facility.fac_ID === id ? { ...facility, ...updated } : facility);
      this.persistToStorage();
      return this.response({ message: 'Mock facility updated', facility: this.facilities.find(facility => facility.fac_ID === id) });
    }

    if (request.method === 'POST' && path.endsWith('/api/facilities/addfacility')) {
      const nextId = Math.max(...this.facilities.map(facility => facility.fac_ID)) + 1;
      const facility = {
        fac_ID: nextId,
        fac_Used: 0,
        fac_Empty: body?.fac_Capacity ?? 0,
        fac_price: 500,
        fac_img: 'service.webp',
        ...body
      };
      this.facilities = [...this.facilities, facility];
      this.timetables[nextId] = [];
      this.persistToStorage();
      return this.response({ message: 'Mock facility added', facility });
    }

    if (request.method === 'POST' && path.endsWith('/api/facilities/addtime')) {
      const facilityId = Number(body?.fac_ID);
      const slot = { ...body, slot_ID: Date.now(), isAvailable: body?.isAvailable ?? true };
      this.timetables[facilityId] = [...(this.timetables[facilityId] ?? []), slot];
      this.persistToStorage();
      return this.response({ message: 'Mock time added', model: slot });
    }

    if (request.method === 'PUT' && path.includes('/api/facilities/edittime/')) {
      const slotId = this.getLastNumber(path);
      Object.keys(this.timetables).forEach(key => {
        this.timetables[Number(key)] = this.timetables[Number(key)].map(slot => slot.slot_ID === slotId ? { ...slot, ...body } : slot);
      });
      this.persistToStorage();
      return this.response({ message: 'Mock time updated' });
    }

    if (request.method === 'DELETE' && path.includes('/api/facilities/deletetime/')) {
      const slotId = this.getLastNumber(path);
      Object.keys(this.timetables).forEach(key => {
        this.timetables[Number(key)] = this.timetables[Number(key)].filter(slot => slot.slot_ID !== slotId);
      });
      this.persistToStorage();
      return this.response({ message: 'Mock time deleted' });
    }

    if (request.method === 'GET' && path.endsWith('/api/employee/empall')) {
      return this.response(this.employees);
    }

    if (request.method === 'POST' && path.endsWith('/api/employee/add-employee')) {
      const employee = { id: Date.now(), status: 'active', ...body };
      this.employees = [...this.employees, employee];
      this.persistToStorage();
      return this.response({ message: 'Mock employee added', employee });
    }

    if (request.method === 'PUT' && path.includes('/api/employee/edit-employee/')) {
      const id = this.getLastNumber(path);
      this.employees = this.employees.map(employee => employee.id === id ? { ...employee, ...body } : employee);
      this.persistToStorage();
      return this.response({ message: 'Mock employee updated' });
    }

    if (request.method === 'DELETE' && path.includes('/api/employee/delete-employee/')) {
      const id = this.getLastNumber(path);
      this.employees = this.employees.filter(employee => employee.id !== id);
      this.persistToStorage();
      return this.response({ message: 'Mock employee deleted' });
    }

    if (request.method === 'POST' && path.endsWith('/api/reservation/reserve')) {
      const facility = this.facilities.find(item => item.fac_ID === Number(body?.Fac_ID));
      const reservation = {
        id: Date.now(),
        r_id: Date.now(),
        fac_Name: facility?.fac_Name ?? 'Facility',
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        r_Date: `${body?.R_Date}T00:00:00`,
        r_Time: body?.R_Time,
        r_Status: 'Pending',
        pay_Amount: facility?.fac_price ?? 0,
        pay_Status: 'Pending'
      };
      this.reservations = [reservation, ...this.reservations];
      this.persistToStorage();
      return this.response({ message: 'Mock reservation created', reservation });
    }

    if (request.method === 'POST' && path.endsWith('/api/payment/pay')) {
      const reservation = this.reservations.find(item => item.r_id === Number(body?.R_id));
      const payment = {
        pay_ID: Date.now(),
        fac_Name: reservation?.fac_Name ?? 'Facility',
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        pay_Date: new Date().toISOString(),
        pay_Amount: reservation?.pay_Amount ?? 0,
        pay_Method: body?.Pay_Method,
        pay_Status: 'Pending'
      };
      this.payments = [payment, ...this.payments];
      if (reservation) {
        reservation.pay_Status = 'Pending';
      }
      this.persistToStorage();
      return this.response({ message: 'Mock payment completed', payment });
    }

    if (request.method === 'GET' && path.endsWith('/api/payment/getresavtionhis')) {
      return this.response(this.reservations);
    }

    if (request.method === 'GET' && path.endsWith('/api/payment/paymentall')) {
      return this.response(this.payments);
    }

    if (request.method === 'GET' && path.endsWith('/api/payment/getreservationstatusall')) {
      return this.response(this.reservations);
    }

    if (request.method === 'PUT' && path.includes('/api/reservation/updatestatus/')) {
      const reservationId = this.getLastNumber(path);
      this.reservations = this.reservations.map(reservation =>
        reservation.r_id === reservationId ? { ...reservation, r_Status: body?.R_Status ?? reservation.r_Status } : reservation
      );
      this.persistToStorage();
      return this.response({ message: 'Mock reservation status updated' });
    }

    if (request.method === 'PUT' && path.includes('/api/payment/updatepaymentstatus/')) {
      const paymentId = this.getLastNumber(path);
      this.payments = this.payments.map(payment =>
        payment.pay_ID === paymentId ? { ...payment, pay_Status: body?.pay_Status ?? payment.pay_Status } : payment
      );
      this.persistToStorage();
      return this.response({ message: 'Mock payment status updated' });
    }

    return this.response({ message: 'Mock endpoint not configured' });
  }

  private isMockApi(url: string): boolean {
    return url.startsWith('http://localhost:5203/api/') || url.startsWith('http://127.0.0.1:5203/api/');
  }

  private response(body: unknown): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(250));
  }

  private getLastNumber(path: string): number {
    return Number(path.split('/').filter(Boolean).pop());
  }

  private getRoleFromEmail(email = ''): string {
    const normalized = email.toLowerCase();
    if (normalized.includes('admin')) return 'Admin';
    if (normalized.includes('staff')) return 'staff';
    return 'User';
  }

  private createToken(role: string): string {
    const payload = {
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role,
      name: role === 'Admin' ? 'Mock Admin' : role === 'staff' ? 'Mock Staff' : 'Mock User'
    };

    return `${this.base64Url({ alg: 'none', typ: 'JWT' })}.${this.base64Url(payload)}.mock`;
  }

  private base64Url(value: object): string {
    return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        this.persistToStorage();
        return;
      }

      const data = JSON.parse(stored);
      this.facilities = data.facilities ?? this.facilities;
      this.timetables = data.timetables ?? this.timetables;
      this.employees = data.employees ?? this.employees;
      this.currentUser = data.currentUser ?? this.currentUser;
      this.reservations = data.reservations ?? this.reservations;
      this.payments = data.payments ?? this.payments;
    } catch {
      this.persistToStorage();
    }
  }

  private persistToStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify({
      facilities: this.facilities,
      timetables: this.timetables,
      employees: this.employees,
      currentUser: this.currentUser,
      reservations: this.reservations,
      payments: this.payments
    }));
  }
}
