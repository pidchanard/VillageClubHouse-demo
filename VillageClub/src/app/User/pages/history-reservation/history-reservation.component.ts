import { myAcc } from './../../../Model/time';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Service/flowbite service/flowbite.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReservationPayment } from '../../../Model/time';
import { AppLanguage, LanguageService } from '../../../Service/language.service';


@Component({
  selector: 'app-history-reservation',
  templateUrl: './history-reservation.component.html',
  styleUrls: ['./history-reservation.component.css']
})
export class HistoryReservationComponent implements OnInit, OnDestroy {
  reservations: ReservationPayment[] = [];
  editReservation: ReservationPayment | null = null;
  acc: myAcc | null = null;
  currentLanguage: AppLanguage = 'th';
  private intervalId?: ReturnType<typeof setInterval>;
  private readonly facilityNames = [
    { th: 'สนามฟุตบอล', en: 'Football field' },
    { th: 'สระว่ายน้ำ', en: 'Swimming pool' },
    { th: 'สนามแบดมินตัน', en: 'Badminton court' },
    { th: 'ห้องจัดเลี้ยง', en: 'Banquet hall' }
  ];
  private readonly content = {
    th: {
      eyebrow: 'Reservation History',
      title: 'ประวัติการจอง',
      subtitle: 'อัปเดตล่าสุด:',
      member: 'ผู้จอง',
      phone: 'เบอร์โทร',
      tableTitle: 'รายการจองทั้งหมด',
      items: 'รายการ',
      no: 'ลำดับ',
      facility: 'สถานที่',
      date: 'วันที่จอง',
      time: 'เวลา',
      deposit: 'ค่ามัดจำ',
      payment: 'ชำระเงิน',
      booking: 'การจอง'
    },
    en: {
      eyebrow: 'Reservation History',
      title: 'Booking history',
      subtitle: 'Last updated:',
      member: 'Member',
      phone: 'Phone',
      tableTitle: 'All reservations',
      items: 'items',
      no: 'No.',
      facility: 'Facility',
      date: 'Date',
      time: 'Time',
      deposit: 'Deposit',
      payment: 'Payment',
      booking: 'Booking'
    }
  };


  constructor(
    private flowbiteService: FlowbiteService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.flowbiteService.loadFlowbite(() => {
        initFlowbite();
      });
    }

    this.currentLanguage = this.languageService.current;
    this.languageService.language$.subscribe(language => {
      this.currentLanguage = language;
      this.updateTime();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.updateTime();
      this.intervalId = setInterval(() => this.updateTime(), 1000);
    }

    this.loadReservations();
    this.loadMyAccount();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadReservations(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  
    this.http.get<ReservationPayment[]>('http://localhost:5203/api/Payment/getresavtionhis', { headers }).subscribe({
      next: data => {
        this.reservations = data;
        this.cdRef.detectChanges();
      },
      error: err => console.error("Error fetching reservation history:", err)
    });
  }
  
  loadMyAccount(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  
    this.http.get<myAcc>('http://localhost:5203/api/User/getmy', { headers }).subscribe({
      next: data => {
        this.acc = data;
        this.cdRef.detectChanges();
      },
      error: err => console.error("Error fetching account info:", err)
    });
  }
  

  openEditModal(reservation: ReservationPayment) {
    this.editReservation = { ...reservation };
  }

  closeModal() {
    this.editReservation = null;
  }

  saveEdit() {
    const index = this.reservations.findIndex(r => r.r_id === this.editReservation?.r_id);
    if (index > -1 && this.editReservation) {
      this.reservations[index] = { ...this.editReservation };
    }
    this.closeModal();
  }

  updateTime(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleString(this.currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const element = document.getElementById("updateTime");
    if (element) {
      element.innerText = formattedTime;
    }
  }

  get text() {
    return this.content[this.currentLanguage];
  }

  getFacilityName(name: string): string {
    if (this.currentLanguage === 'th') {
      return name;
    }

    const matched = this.facilityNames.find(item => name?.includes(item.th));
    return matched?.en ?? name;
  }

  getStatusLabel(status: string): string {
    if (this.currentLanguage === 'en') {
      return status;
    }

    const normalized = status?.toLowerCase();
    if (normalized === 'active') return 'พร้อมใช้งาน';
    if (normalized === 'inactive') return 'ปิดใช้งาน';
    if (normalized === 'pending') return 'รอดำเนินการ';
    if (normalized === 'verified') return 'ยืนยันแล้ว';
    return status;
  }
}
