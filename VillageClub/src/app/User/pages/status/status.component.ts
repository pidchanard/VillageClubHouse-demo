import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HttpClient } from '@angular/common/http';
import { FlowbiteService } from '../../../Service/flowbite service/flowbite.service';
import { AppLanguage, LanguageService } from '../../../Service/language.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'] // ✅ แก้ styleUrl → styleUrls (s)
})
export class StatusComponent implements OnInit, OnDestroy {

  facilities: any[] = [];
  currentLanguage: AppLanguage = 'th';
  private intervalId?: ReturnType<typeof setInterval>;
  private readonly facilityText: Record<number, { enName: string }> = {
    1: { enName: 'Football field' },
    2: { enName: 'Swimming pool' },
    3: { enName: 'Badminton court' },
    4: { enName: 'Banquet hall' }
  };
  private readonly content = {
    th: {
      eyebrow: 'Facility Status',
      title: 'สถานะพื้นที่ให้บริการ',
      subtitle: 'อัปเดตล่าสุด:',
      facility: 'พื้นที่'
    },
    en: {
      eyebrow: 'Facility Status',
      title: 'Facility availability',
      subtitle: 'Last updated:',
      facility: 'Facility'
    }
  };

  constructor(private flowbiteService: FlowbiteService, 
              private http: HttpClient,
              private languageService: LanguageService,
              @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.flowbiteService.loadFlowbite(() => {
        initFlowbite();
      });
    }

    this.http.get<any[]>('http://localhost:5203/api/facilities/getFacilities').subscribe(data => {
      this.facilities = data;
    });

    this.currentLanguage = this.languageService.current;
    this.languageService.language$.subscribe(language => {
      this.currentLanguage = language;
      this.updateTime();
    });

    // ✅ เรียกใช้ updateTime ตอนเริ่ม
    if (isPlatformBrowser(this.platformId)) {
      this.updateTime();
      this.intervalId = setInterval(() => this.updateTime(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  getFacilityName(facility: any): string {
    if (this.currentLanguage === 'en') {
      return this.facilityText[facility.fac_ID]?.enName ?? facility.fac_Name;
    }

    return facility.fac_Name;
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
