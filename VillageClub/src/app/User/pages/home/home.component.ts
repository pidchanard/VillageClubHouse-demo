import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowbiteService } from '../../../Service/flowbite service/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AppLanguage, LanguageService } from '../../../Service/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  currentLanguage: AppLanguage = 'th';

  private readonly content = {
    th: {
      eyebrow: 'Village Club House',
      title: 'จองพื้นที่กีฬาและบริการของคลับได้ง่ายขึ้น',
      subtitle: 'จัดการการจอง เช็กสถานะสนาม และเข้าถึงบริการสมาชิกในประสบการณ์เดียวที่ทันสมัยกว่าเดิม',
      book: 'จองตอนนี้',
      status: 'ดูสถานะ',
      today: 'วันนี้',
      bookings: 'รายการจอง',
      facilityEyebrow: 'Facilities',
      facilityTitle: 'พื้นที่ยอดนิยม',
      whyEyebrow: 'Why Choose Us',
      whyTitle: 'ทุกอย่างพร้อมสำหรับวันพักผ่อนและออกกำลังของคุณ',
      ctaEyebrow: 'Ready to play',
      ctaTitle: 'เลือกสนาม เลือกเวลา แล้วเริ่มใช้งานได้เลย'
    },
    en: {
      eyebrow: 'Village Club House',
      title: 'Book courts, facilities, and club services with ease',
      subtitle: 'Manage reservations, check availability, and access member services in one cleaner club experience.',
      book: 'Book now',
      status: 'View status',
      today: 'Today',
      bookings: 'bookings',
      facilityEyebrow: 'Facilities',
      facilityTitle: 'Popular spaces',
      whyEyebrow: 'Why Choose Us',
      whyTitle: 'Everything is ready for your active day',
      ctaEyebrow: 'Ready to play',
      ctaTitle: 'Choose a facility, pick a time, and start your club session.'
    }
  };

  readonly facilityContent = {
    th: [
      { name: 'Fitness', image: 'logoFitness.webp', copy: 'อุปกรณ์ครบ พร้อมพื้นที่ออกกำลังกายที่สะอาดและปลอดภัย' },
      { name: 'Futsal', image: 'logoFootball.webp', copy: 'สนามคุณภาพสำหรับทีมของคุณ ทั้งซ้อมและแข่งขัน' },
      { name: 'Swimming', image: 'logoSwimming.webp', copy: 'สระว่ายน้ำสำหรับออกกำลังและพักผ่อนในวันสบาย ๆ' },
      { name: 'Badminton', image: 'logoBatminton.webp', copy: 'คอร์ทในร่มสำหรับการเล่นที่ต่อเนื่องทุกสภาพอากาศ' },
      { name: 'Banquet', image: 'logoBanquet.webp', copy: 'พื้นที่จัดเลี้ยงและกิจกรรมสำหรับสมาชิกและครอบครัว' }
    ],
    en: [
      { name: 'Fitness', image: 'logoFitness.webp', copy: 'Modern equipment with a clean and safe workout zone.' },
      { name: 'Futsal', image: 'logoFootball.webp', copy: 'Quality courts for practice sessions, matches, and team play.' },
      { name: 'Swimming', image: 'logoSwimming.webp', copy: 'Pools for training, recovery, and relaxed weekends.' },
      { name: 'Badminton', image: 'logoBatminton.webp', copy: 'Indoor courts for smooth play in every season.' },
      { name: 'Banquet', image: 'logoBanquet.webp', copy: 'Event spaces for members, families, and private gatherings.' }
    ]
  };

  readonly benefitContent = {
    th: [
      { icon: 'calendar_month', title: 'จองออนไลน์', copy: 'เลือกสนามและช่วงเวลาล่วงหน้าได้อย่างรวดเร็ว' },
      { icon: 'verified', title: 'สถานะชัดเจน', copy: 'เช็กความพร้อมของพื้นที่ก่อนเดินทางมาใช้งาน' },
      { icon: 'cleaning_services', title: 'สะอาดปลอดภัย', copy: 'ดูแลอุปกรณ์และพื้นที่ให้พร้อมใช้งานอยู่เสมอ' },
      { icon: 'local_parking', title: 'เดินทางสะดวก', copy: 'มีพื้นที่รองรับสมาชิกและผู้มาใช้บริการ' }
    ],
    en: [
      { icon: 'calendar_month', title: 'Online booking', copy: 'Pick a facility and time slot before you arrive.' },
      { icon: 'verified', title: 'Clear status', copy: 'Check facility readiness from the member portal.' },
      { icon: 'cleaning_services', title: 'Clean and safe', copy: 'Spaces and equipment are kept ready for daily use.' },
      { icon: 'local_parking', title: 'Easy access', copy: 'Convenient support for members and visitors.' }
    ]
  };

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.currentLanguage = this.languageService.current;
    this.languageService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  get text() {
    return this.content[this.currentLanguage];
  }

  get facilities() {
    return this.facilityContent[this.currentLanguage];
  }

  get benefits() {
    return this.benefitContent[this.currentLanguage];
  }

}
