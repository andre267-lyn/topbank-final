import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    constructor(private router: Router) {}

    navigateToProfile() {
      // Implementasikan logika untuk navigasi ke halaman profil
      // Anda dapat menggunakan layanan Router untuk navigasi
      this.router.navigate(['/profil']);
    }
  
    logout() {
      // Implementasikan logika untuk logout
      // Anda dapat melakukan tindakan yang diperlukan, seperti membersihkan sesi, dll.
      this.router.navigate(['/login']); // Redirect ke halaman login setelah logout
    }
}
