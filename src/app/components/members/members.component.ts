import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { TeamsService } from '../../services/teams/teams.service';
import { getAvatarColor } from '../../utils/avatar';
import { User, UsersResponse } from '../../models/user.model';
import { Spinner } from '@primeicons/angular/spinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { Pencil } from '@primeicons/angular/pencil';

@Component({
  imports: [AvatarModule, TableModule, TagModule, Spinner, Pencil],
  selector: 'bw-members',
  styleUrl: './members.component.css',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly teamsService = inject(TeamsService);

  allUsersList = signal<User[]>([]);
  teamNames = signal<Record<string, string>>({});
  searchTerm = signal('');
  isLoadingData = signal(false);

  filteredUsers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.allUsersList();
    }

    return this.allUsersList().filter((user) => {
      const name = `${user.first_name} ${user.last_name}`.toLowerCase();
      const team = this.getTeamName(user).toLowerCase();

      return name.includes(search)
        || user.email.toLowerCase().includes(search)
        || user.username.toLowerCase().includes(search)
        || user.role.toLowerCase().includes(search)
        || team.includes(search);
    });
  });

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchTeams();
  }

  fetchAllUsers(): void {
    this.isLoadingData.set(true);
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        const userList = Array.isArray(users)
          ? users
          : this.isUsersResponse(users)
            ? users.response
            : [];
        this.allUsersList.set(userList);
        this.isLoadingData.set(false);
      },
      error: (error) => {
        console.error('Unable to load members', error);
        this.isLoadingData.set(false);
      },
    });
  }

  private isUsersResponse(users: User[] | UsersResponse): users is UsersResponse {
    return !Array.isArray(users) && Array.isArray(users.response);
  }

  fetchTeams(): void {
    this.teamsService.getAllTeams().subscribe({
      next: (response) => {
        const names = response.response.reduce<Record<string, string>>((teamMap, team) => {
          teamMap[team.id] = team.name;
          return teamMap;
        }, {});
        this.teamNames.set(names);
      },
      error: (error) => {
        console.error('Unable to load member team names', error);
      },
    });
  }

  getFullName(user: User): string {
    return `${user.first_name} ${user.last_name}`.trim() || user.username;
  }

  getInitials(user: User): string {
    const firstInitial = user.first_name?.charAt(0) ?? '';
    const lastInitial = user.last_name?.charAt(0) ?? '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || user.username.slice(0, 2).toUpperCase();
  }

  getAvatarColor(user: User): string {
    return getAvatarColor(this.getInitials(user));
  }

  getTeamName(user: User): string {
    return user.team_id ? this.teamNames()[user.team_id] ?? user.team_id : '—';
  }

  formatRole(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  }

  getRoleSeverity(role: string): 'danger' | 'info' | 'secondary' {
    switch (role.trim().toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'manager':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
