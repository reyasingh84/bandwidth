import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Home } from '@primeicons/angular/home';
import { Inbox } from '@primeicons/angular/inbox';
import { Search } from '@primeicons/angular/search';
import { Bell } from '@primeicons/angular/bell';
import { ChartBar } from '@primeicons/angular/chart-bar';
import { ChevronDown } from '@primeicons/angular/chevron-down';
import { Users } from '@primeicons/angular/users';
import { Calendar } from '@primeicons/angular/calendar';
import { Cog } from '@primeicons/angular/cog';
import { Sidebar } from '@primeicons/angular/sidebar';
import { Comment } from '@primeicons/angular/comment';
import { FileCheck } from '@primeicons/angular/file-check';
import { Columns2 } from '@primeicons/angular/columns-2';
import { User } from '@primeicons/angular/user';
import { ListCheck } from '@primeicons/angular/list-check';
import { ChartLine } from '@primeicons/angular/chart-line';
import { SignOut } from '@primeicons/angular/sign-out';
import { Clipboard } from '@primeicons/angular/clipboard';
import { CardModule } from 'primeng/card';
import { PIcon } from '@primeicons/angular/p-icon';
import { SIDEBAR_NAVIGATION } from '../../constants/sidebar-navigation';
@Component({
  imports: [SidebarModule, ButtonModule, CardModule, RouterLink, RouterOutlet, RouterLinkActive, PIcon, Comment, Sidebar, Cog, Clipboard, Users, User, ChevronDown, ChartBar, Bell, Search, SignOut, Home, FileCheck, ListCheck, Columns2, ChartLine],
  selector: 'bw-bandwidth',
  styleUrl: './bandwidth.component.css',
  templateUrl: './bandwidth.component.html',
})
export class BandwidthComponent implements OnInit {
  protected readonly navigation = SIDEBAR_NAVIGATION;

  isMobile = signal(false);
    navOpen = signal(true);
    open = signal(false);
    private mql?: MediaQueryList;
    private mqlListener?: (e: MediaQueryListEvent) => void;
    ngOnInit() {
        if (typeof window === 'undefined') return;
        this.mql = window.matchMedia('(max-width: 1023px)');
        this.isMobile.set(this.mql.matches);
        this.navOpen.set(!this.mql.matches);
        this.mqlListener = (e) => {
            this.isMobile.set(e.matches);
            this.navOpen.set(!e.matches);
        };
        this.mql.addEventListener('change', this.mqlListener);
    }
    ngOnDestroy() {
        this.mql?.removeEventListener('change', this.mqlListener!);
    }
}
