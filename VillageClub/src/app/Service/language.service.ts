import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'th' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'app-language';
  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.getInitialLanguage());
  readonly language$ = this.languageSubject.asObservable();

  get current(): AppLanguage {
    return this.languageSubject.value;
  }

  toggle(): void {
    this.setLanguage(this.current === 'th' ? 'en' : 'th');
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, language);
    }
  }

  private getInitialLanguage(): AppLanguage {
    if (typeof localStorage === 'undefined') {
      return 'th';
    }

    const storedLanguage = localStorage.getItem(this.storageKey);
    return storedLanguage === 'en' ? 'en' : 'th';
  }
}
