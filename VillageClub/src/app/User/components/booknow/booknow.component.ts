import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, OnInit, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Service/flowbite service/flowbite.service';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-booknow',
  templateUrl: './booknow.component.html',
  styleUrls: ['./booknow.component.css']
})
export class BooknowComponent implements OnInit, AfterViewInit {

  selectedDate: string = '';  // ตัวแปรเพื่อเก็บวันที่ที่เลือก

  constructor(
    private flowbiteService: FlowbiteService,
    private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private ngZone: NgZone,  // Inject NgZone for manual zone running
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.flowbiteService.loadFlowbite(() => {
        initFlowbite();
      });
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7); // เพิ่ม 7 วันให้กับวันที่ปัจจุบัน

    const datepicker = document.querySelector("#datepicker");

    if (datepicker) {
      flatpickr(datepicker, {
        enableTime: false,  
        dateFormat: "d F Y", // แสดงวันที่ในรูปแบบ เช่น "Wednesday, 30 June 2024"
        defaultDate: today, // ตั้งค่าวันที่เริ่มต้นเป็นวันนี้
        minDate: today, // จำกัดไม่ให้เลือกวันที่ก่อนวันนี้
        maxDate: maxDate, // จำกัดให้เลือกได้สูงสุดแค่ 7 วัน
        onChange: (selectedDates) => {
          console.log('Selected Date:', selectedDates); // ตรวจสอบค่าวันที่ที่เลือก
          this.selectedDate = selectedDates[0] ? selectedDates[0].toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

          console.log('Updated selectedDate:', this.selectedDate); // ตรวจสอบว่า selectedDate ถูกอัปเดตหรือไม่
          
          // ใช้ NgZone เพื่อบังคับให้ Angular รู้ว่าเรามีการเปลี่ยนแปลงใน UI
          this.ngZone.run(() => {
            this.cdRef.detectChanges(); // Trigger change detection
          });
        }
      });
    }
  }
}
