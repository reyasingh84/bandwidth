import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TaskHistoryEntry, TaskInfo } from '../../models/tasks.model';
import { Times } from '@primeicons/angular/times';
import { PIcon } from '@primeicons/angular/p-icon';
import { TeamsService } from '../../services/teams/teams.service';
import { getAvatarColor } from '../../utils/avatar';

@Component({
  imports: [SidebarModule, ButtonModule, DatePipe, Times, PIcon],
  selector: 'bw-task-preview',
  styleUrl: './task-preview.component.css',
  templateUrl: './task-preview.component.html',
})
export class TaskPreviewComponent {
  private readonly teamsService = inject(TeamsService);
  task = input.required<TaskInfo>();
  closed = output<void>();
  open = true;
  readonly currentTime = Math.floor(Date.now() / 1000);
  readonly teamName = signal('');
  readonly teamShortName = signal('');
  readonly teamLoading = signal(false);

  readonly mockComments = [
    {
      author: 'Aman Girdhar',
      initials: 'AG',
      text: 'Task preview is ready for review.',
      timestamp: 'Today',
    },
  ];

  constructor() {
    effect(() => {
      const teamId = this.task().team_id;
      this.teamName.set('');
      this.teamShortName.set('');

      if (!teamId) {
        return;
      }

      this.teamLoading.set(true);
      this.teamsService.getTeamById(teamId).subscribe({
        next: (team) => {
          this.teamName.set(team?.name ?? teamId);
          this.teamShortName.set(team?.short_name ?? '');
        },
        error: (error) => {
          console.error('Unable to load task team', error);
          this.teamName.set(teamId);
          this.teamLoading.set(false);
        },
        complete: () => this.teamLoading.set(false),
      });
    });
  }

  get historyEntries(): Array<{ key: string; entry: TaskHistoryEntry }> {
    return Object.entries(this.task().history ?? {}).map(([key, entry]) => ({ key, entry }));
  }

  getTeamName(): string {
    return this.teamName() || this.task().team_name || this.task().team_id;
  }

  getTeamShortName(): string {
    return this.teamShortName() || this.getTeamName().slice(0, 3).toUpperCase();
  }

  getAvatarColor(value: string): string {
    return getAvatarColor(value);
  }

  getAssigneeName(): string {
    return this.task().assignee_username || 'Unassigned';
  }

  getAssigneeInitials(): string {
    return this.getUsernameInitial(this.getAssigneeName());
  }

  getReporterInitials(): string {
    return this.getUsernameInitial(this.task().reporter_username);
  }

  private getUsernameInitial(username: string): string {
    if (username === 'Unassigned') {
      return 'U';
    }

    return username.trim().charAt(0).toUpperCase() || 'U';
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  }

  priorityLabel(priority: number): string {
    if (priority >= 5) {
      return 'High';
    }

    if (priority >= 3) {
      return 'Medium';
    }

    return 'Low';
  }

  close(): void {
    this.open = false;
    this.closed.emit();
  }
}
