import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
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
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { User as UserModel } from '../../models/user.model';
import { UsersService } from '../../services/users/users.service';
import { ROUTE_TITLES } from '../../constants/route-titles';
import { filter, Subscription } from 'rxjs';
@Component({
  imports: [SidebarModule, ButtonModule, CardModule, RouterLink, RouterOutlet, RouterLinkActive, PIcon, Comment, Sidebar, Cog, Clipboard, Users, User, ChevronDown, ChartBar, Bell, Search, SignOut, Home, FileCheck, ListCheck, Columns2, ChartLine],
  selector: 'bw-bandwidth',
  styleUrl: './bandwidth.component.css',
  templateUrl: './bandwidth.component.html',
})
export class BandwidthComponent implements OnInit, OnDestroy {
  protected readonly navigation = this.getNavigationForCurrentUser();
  authService = inject(AuthService);
  messageService = inject(MessageService);
  usersService = inject(UsersService);
  router = inject(Router);
  currentPageTitle = signal('Dashboard');
  private routerSubscription?: Subscription;

  isMobile = signal(false);
  navOpen = signal(true);
  open = signal(false);
  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  get userInitials(): string {
    const user = this.usersService.getUserInfo();
    const firstInitial = user?.first_name?.trim().charAt(0) ?? '';
    const lastInitial = user?.last_name?.trim().charAt(0) ?? '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  }

  private getNavigationForCurrentUser() {
    const userDetails = localStorage.getItem('userDetails');

    if (!userDetails) {
      return [];
    }

    try {
      const user = JSON.parse(userDetails) as Partial<UserModel>;
      const role = typeof user.role === 'string' ? user.role.trim().toLowerCase() : '';

      return SIDEBAR_NAVIGATION
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.roles.some((allowedRole) => allowedRole === role)),
        }))
        .filter((group) => group.items.length > 0);
    } catch {
      return [];
    }
  }

  ngOnInit() {
      if (typeof window === 'undefined') return;
      this.updatePageTitle(this.router.url);
      this.routerSubscription = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => this.updatePageTitle(event.urlAfterRedirects));
      this.mql = window.matchMedia('(max-width: 1023px)');
      this.isMobile.set(this.mql.matches);
      this.navOpen.set(!this.mql.matches);
      this.mqlListener = (e) => {
          this.isMobile.set(e.matches);
          this.navOpen.set(!e.matches);
      };
      this.mql.addEventListener('change', this.mqlListener);
  }

  private updatePageTitle(url: string): void {
    const route = url.split('?')[0].replace(/\/+$/, '') || '/dashboard';
    this.currentPageTitle.set(ROUTE_TITLES[route] ?? 'Dashboard');
  }

  onClickLogout(){
    this.authService.logout()
    this.messageService.add({
      summary: "Successfully Logged Out!",
      severity: "success"
    })
  }

  ngOnDestroy() {
      this.routerSubscription?.unsubscribe();
      this.mql?.removeEventListener('change', this.mqlListener!);
  }
}
