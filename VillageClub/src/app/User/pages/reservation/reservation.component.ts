import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, NgZone, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Service/flowbite service/flowbite.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import flatpickr from 'flatpickr';
import { TimetableSlot } from '../../../Model/time';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppLanguage, LanguageService } from '../../../Service/language.service';



@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit, AfterViewInit {

  facilities: any[] = [];
  reservationDate: string = '';
  flatpickrInstance: any = null;
  selectedFacility: any = null;
  timetables: TimetableSlot[] = [];
  showQRCode: boolean = false;
  paymentMethod: string = '';
  selectedSlot: TimetableSlot | null = null;
  reservationId: number | null = null;
  currentLanguage: AppLanguage = 'th';
  private readonly facilityText: Record<number, { enName: string; enDescription: string }> = {
    1: {
      enName: 'Football field',
      enDescription: 'Synthetic turf football field for small and full teams.'
    },
    2: {
      enName: 'Swimming pool',
      enDescription: 'Saltwater pool with comfortable relaxation areas.'
    },
    3: {
      enName: 'Badminton court',
      enDescription: 'Indoor badminton court with standard flooring.'
    },
    4: {
      enName: 'Banquet hall',
      enDescription: 'Private event and meeting hall for club members.'
    }
  };
  private readonly content = {
    th: {
      eyebrow: 'Reservation',
      title: 'จองพื้นที่ของคุณ',
      subtitle: 'เลือกสนามหรือบริการ ตรวจสอบเวลา และยืนยันการจองได้ในขั้นตอนเดียว',
      facility: 'พื้นที่',
      bookNow: 'จองตอนนี้',
      booking: 'รายละเอียดการจอง',
      selectDate: 'เลือกวันที่',
      noDate: 'ยังไม่ได้เลือกวันที่',
      total: 'ยอดชำระ:',
      choosePayment: 'เลือกวิธีชำระเงิน',
      pay: 'ชำระเงิน',
      note: 'หมายเหตุ: การจองที่ยืนยันแล้วไม่สามารถคืนเงินมัดจำได้ทุกกรณี',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยันการจอง'
    },
    en: {
      eyebrow: 'Reservation',
      title: 'Book your space',
      subtitle: 'Choose a facility, review available time slots, and confirm your booking in one flow.',
      facility: 'Facility',
      bookNow: 'Book now',
      booking: 'Booking details',
      selectDate: 'Select date',
      noDate: 'No date selected',
      total: 'Total:',
      choosePayment: 'Choose payment method',
      pay: 'Pay now',
      note: 'Note: confirmed reservations are non-refundable.',
      cancel: 'Cancel',
      confirm: 'Confirm booking'
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
    });

    this.http.get<any[]>('http://localhost:5203/api/facilities/getFacilities').subscribe(data => {
      this.facilities = data;
      this.cdRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFlatpickr();
    }
  }

  initializeFlatpickr(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const datepicker = document.querySelector("#datepicker");

    if (datepicker) {
      this.flatpickrInstance = flatpickr(datepicker as HTMLInputElement, {
        enableTime: false,
        dateFormat: "d F Y",
        defaultDate: today,
        minDate: today,
        maxDate: maxDate,
        onChange: (selectedDates) => {
          this.reservationDate = selectedDates[0]
            ? selectedDates[0].toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : '';

          this.ngZone.run(() => {
            this.cdRef.detectChanges();
          });
        }
      });
    }
  }

  openModal(facility: any) {
    this.selectedFacility = facility;

    this.http.get<TimetableSlot[]>(`http://localhost:5203/api/facilities/getTimetable/${facility.fac_ID}`)
      .subscribe(times => {
        this.timetables = times;
        this.cdRef.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initializeFlatpickr();
          }, 100);
        }
      });
  }

  closeModal(): void {
    this.resetDate();
  }

  getDurationFromLabel(label: string): number {
    const parts = label.split('-');
    if (parts.length !== 2) return 1; // default duration
  
    const start = parseFloat(parts[0].trim().replace(':', '.')); // "10.00" → 10
    const end = parseFloat(parts[1].trim().replace(':', '.'));   // "12.00" → 12
  
    if (isNaN(start) || isNaN(end)) return 1;
  
    const duration = end - start;
    return duration > 0 ? duration : 1;
  }
  

  confirmReservation(): void {
    if (!this.selectedSlot || !this.selectedFacility) {
      this.showAlert('warning', 'ยังไม่ได้เลือกเวลา', 'กรุณาเลือกช่วงเวลาให้เรียบร้อยก่อนยืนยันการจอง');
      return;
    }
  
    const parsedDate = this.flatpickrInstance.selectedDates?.[0];
    const formattedDate = parsedDate ? format(parsedDate, 'yyyy-MM-dd') : null;
  
    if (!formattedDate) {
      this.showAlert('warning', 'ยังไม่ได้เลือกวันที่', 'กรุณาเลือกวันที่ก่อนทำการจอง');
      return;
    } 
    const duration = this.getDurationFromLabel(this.selectedSlot.label);
  
    const request = {
      Fac_ID: this.selectedFacility.fac_ID,
      R_Date: formattedDate,
      R_Time: this.selectedSlot.label,
      R_Duration: duration
    };
  
    // ✅ แนบ Token
    const token = localStorage.getItem('token'); // หรือ sessionStorage แล้วแต่ที่ใช้
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    this.http.post('http://localhost:5203/api/Reservation/reserve', request, { headers }).subscribe({
      next: (res: any) => {
        this.reservationId = res.reservation.r_id;
        this.showQRCode = true;
        this.showAlert('success', 'จองสำเร็จ', res.message || 'ระบบบันทึกการจองของคุณเรียบร้อยแล้ว');
      },
      error: (err) => {
        console.error(err);
        this.showAlert('error', 'จองไม่สำเร็จ', 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
      }
    });
  }
  

  resetDate(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    this.reservationDate = '';
    this.timetables = [];
    this.selectedFacility = null;
    this.selectedSlot = null;
    this.showQRCode = false;
    this.paymentMethod = '';

    const timetableRadios = document.querySelectorAll('input[name="timetable"]') as NodeListOf<HTMLInputElement>;
    timetableRadios.forEach(radio => (radio.checked = false));

    this.cdRef.detectChanges();
  }

  payNow() {
    if (!this.paymentMethod || !this.reservationId) {
      this.showAlert('warning', 'ข้อมูลไม่ครบ', 'กรุณาเลือกวิธีชำระเงิน หรือข้อมูลการจองไม่ครบ');
      return;
    }
  
    const token = localStorage.getItem('token'); // ดึง JWT จาก local storage
  
    if (!token) {
      this.showAlert('error', 'กรุณาเข้าสู่ระบบใหม่', 'ไม่พบ Token สำหรับยืนยันตัวตน');
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    const payload = {
      R_id: this.reservationId,
      Pay_Method: this.paymentMethod
    };
  
    this.http.post('http://localhost:5203/api/Payment/pay', payload, { headers }).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'ชำระเงินสำเร็จ',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          buttonsStyling: false,
          customClass: this.alertClass
        }).then(() => {
          this.showQRCode = false; // ปิด QR Code
          this.router.navigate(['/history']); // Redirect ไปหน้าประวัติการจอง
        });
      },
      error: (err) => {
        console.error("🚫 Payment Error", err);
        this.showAlert('error', 'ชำระเงินไม่สำเร็จ', 'เกิดข้อผิดพลาดในการชำระเงิน: ' + err.message);
      }
    });
  }
  
  
  
  calculateTotalPrice(): number {
  if (!this.selectedFacility || !this.selectedSlot) return 0;

  const [startTime, endTime] = this.selectedSlot.label.split('-').map(time => time.trim());

  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);

  const duration = endHour - startHour;

  return (duration * this.selectedFacility.fac_price ) / 2 ;
  }

  get text() {
    return this.content[this.currentLanguage];
  }

  getFacilityName(facility: any): string {
    if (this.currentLanguage === 'en') {
      return this.facilityText[facility.fac_ID]?.enName ?? facility.fac_Name;
    }

    return facility.fac_Name;
  }

  getFacilityDescription(facility: any): string {
    if (this.currentLanguage === 'en') {
      return this.facilityText[facility.fac_ID]?.enDescription ?? facility.fac_Description;
    }

    return facility.fac_Description;
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

  private readonly alertClass = {
    popup: 'club-alert',
    title: 'club-alert-title',
    htmlContainer: 'club-alert-text',
    confirmButton: 'club-alert-confirm'
  };

  private showAlert(icon: 'success' | 'warning' | 'error' | 'info', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'ตกลง',
      buttonsStyling: false,
      customClass: this.alertClass
    });
  }

}
