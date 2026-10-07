import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { Pencil } from '@primeicons/angular/pencil';
import { TaskHistoryEntry, TaskInfo } from '../../models/tasks.model';
import { User } from '../../models/user.model';
import { Times } from '@primeicons/angular/times';
import { TeamsService } from '../../services/teams/teams.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { UsersService } from '../../services/users/users.service';
import { getAvatarColor } from '../../utils/avatar';

@Component({
  imports: [SidebarModule, ButtonModule, TimelineModule, DatePipe, Times, Pencil],
  selector: 'bw-task-preview',
  styleUrl: './task-preview.component.css',
  templateUrl: './task-preview.component.html',
})
export class TaskPreviewComponent {
  private readonly teamsService = inject(TeamsService);
  private readonly tasksService = inject(TasksService);
  private readonly usersService = inject(UsersService);
  task = input.required<TaskInfo>();
  closed = output<void>();
  open = true;
  readonly currentTime = Math.floor(Date.now() / 1000);
  readonly teamName = signal('');
  readonly teamShortName = signal('');
  readonly teamLoading = signal(false);
  readonly teamMembers = signal<User[]>([]);
  readonly statusEditing = signal(false);
  readonly statusSaving = signal(false);
  readonly status = signal('');
  readonly editingField = signal<string | null>(null);
  readonly savingField = signal<string | null>(null);
  readonly draftValue = signal('');
  readonly taskOverrides = signal<Partial<TaskInfo>>({});
  readonly activeHistoryView = signal<'comments' | 'activity'>('comments');
  private statusBeforeEdit = '';
  readonly statusOptions = ['open', 'in_progress', 'review', 'testing', 'on_hold', 'closed'];
  readonly categoryOptions = ['bug', 'testing', 'task'];
  readonly priorityOptions = [1, 2, 3, 4, 5];

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
      this.status.set(this.normalizeStatus(this.task().status));
      this.teamName.set('');
      this.teamShortName.set('');
      this.teamMembers.set([]);

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
          this.teamName.set(teamId);
          this.teamLoading.set(false);
        },
        complete: () => this.teamLoading.set(false),
      });

      this.teamsService.getTeamMembers(teamId).subscribe({
        next: (members) => {
          this.teamMembers.set(members);
        },
        error: (error) => {
          this.teamMembers.set([]);
        },
      });
    });
  }

  get historyEntries(): Array<{ key: string; entry: TaskHistoryEntry }> {
    return Object.entries(this.task().history ?? {})
      .map(([key, entry]) => ({ key, entry }))
      .sort((first, second) => second.entry.timestamp - first.entry.timestamp);
  }

  getHistoryInitial(visible: string): string {
    return visible.trim().charAt(0).toUpperCase() || '—';
  }

  getTeamName(): string {
    return this.teamName() || this.task().team_name || (this.taskValue('team_id') as string);
  }

  getTeamShortName(): string {
    return this.teamShortName() || this.getTeamName().slice(0, 3).toUpperCase();
  }

  getAvatarColor(value: string): string {
    return getAvatarColor(value);
  }

  getAssigneeName(): string {
    return (this.taskValue('assignee_username') as string | null) || 'Unassigned';
  }

  getAssigneeInitials(): string {
    return this.getUsernameInitial(this.getAssigneeName());
  }

  getAssigneeDisplayName(member: User): string {
    return member.username || `${member.first_name} ${member.last_name}`.trim();
  }

  getReporterInitials(): string {
    return this.getUsernameInitial(this.taskValue('reporter_username') as string);
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

  canEditField(field: keyof TaskInfo): boolean {
    const user = this.usersService.getUserInfo();
    const role = user?.role?.trim().toLowerCase();

    if (role === 'admin' || role === 'director') {
      return true;
    }

    if (role === 'manager') {
      return user?.team_id === this.task().team_id;
    }

    if (role === 'employee') {
      return field === 'status' && user?.id === this.task().assignee_id;
    }

    return false;
  }

  taskValue<K extends keyof TaskInfo>(field: K): TaskInfo[K] {
    return (this.taskOverrides()[field] ?? this.task()[field]) as TaskInfo[K];
  }

  startFieldEditing(field: keyof TaskInfo): void {
    if (this.savingField() || !this.canEditField(field)) {
      return;
    }

    const value = this.taskValue(field);
    this.editingField.set(field);
    this.draftValue.set(field === 'deadline'
      ? new Date(Number(value) * 1000).toISOString().slice(0, 10)
      : String(value ?? ''));
  }

  cancelFieldEditing(): void {
    if (!this.savingField()) {
      this.editingField.set(null);
    }
  }

  updateField(field: keyof TaskInfo): void {
    if (!this.canEditField(field)) {
      return;
    }

    const rawValue = this.draftValue();
    const value = field === 'priority'
      ? Number(rawValue)
      : field === 'deadline'
        ? Math.floor(new Date(`${rawValue}T23:59:59`).getTime() / 1000)
        : rawValue.trim();

    if (field === 'priority' && (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5)) {
      return;
    }

    if (String(value) === String(this.taskValue(field))) {
      this.editingField.set(null);
      return;
    }

    this.savingField.set(field);
    this.tasksService.updateTask(this.task().id, field, value).subscribe({
      next: () => {
        this.taskOverrides.update((overrides) => ({ ...overrides, [field]: value }));
        if (field === 'team_id') {
          this.teamName.set('');
          this.teamShortName.set('');
        }
        this.editingField.set(null);
        this.savingField.set(null);
      },
      error: (error) => {
        this.savingField.set(null);
      },
    });
  }

  updateAssignee(event: Event): void {
    if (!this.canEditField('assignee_id')) {
      return;
    }

    const selectedValue = (event.target as HTMLSelectElement).value;
    const assigneeId = selectedValue || null;
    const currentAssigneeId = this.taskValue('assignee_id') || null;
    const member = assigneeId
      ? this.teamMembers().find((candidate) => candidate.id === assigneeId)
      : undefined;

    if (assigneeId === currentAssigneeId || (assigneeId && !member)) {
      this.editingField.set(null);
      return;
    }

    this.savingField.set('assignee_id');
    this.tasksService.updateTaskAssignee(this.task().id, assigneeId).subscribe({
      next: () => {
        this.taskOverrides.update((overrides) => ({
          ...overrides,
          assignee_id: assigneeId,
          assignee_username: member ? this.getAssigneeDisplayName(member) : null,
        }));
        this.editingField.set(null);
        this.savingField.set(null);
      },
      error: (error) => {
        this.savingField.set(null);
      },
    });
  }

  updateDraft(event: Event): void {
    this.draftValue.set((event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value);
  }

  private normalizeStatus(status: string): string {
    return status.trim().toLowerCase().replace(/[\s-]+/g, '_');
  }

  startStatusEditing(): void {
    if (!this.statusSaving() && this.canEditField('status')) {
      this.statusBeforeEdit = this.normalizeStatus(this.task().status);
      this.status.set(this.statusBeforeEdit);
      this.statusEditing.set(true);
    }
  }

  cancelStatusEditing(): void {
    if (this.statusEditing() && !this.statusSaving()) {
      this.status.set(this.statusBeforeEdit);
      this.statusEditing.set(false);
    }
  }

  handlePreviewClick(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLElement && !target.closest('.task-preview-status-field, .task-preview-inline-editor')) {
      this.cancelStatusEditing();
      this.cancelFieldEditing();
    }
  }

  updateStatus(event: Event): void {
    if (!this.canEditField('status')) {
      return;
    }

    const select = event.target as HTMLSelectElement;
    const nextStatus = select.value;
    const previousStatus = this.statusBeforeEdit;

    if (nextStatus === previousStatus) {
      this.status.set(previousStatus);
      this.statusEditing.set(false);
      return;
    }

    this.status.set(nextStatus);
    this.statusSaving.set(true);
    this.tasksService.updateTask(this.task().id, 'status', nextStatus).subscribe({
      next: () => {
        this.statusEditing.set(false);
        this.statusSaving.set(false);
      },
      error: (error) => {
        this.status.set(previousStatus);
        this.statusEditing.set(false);
        this.statusSaving.set(false);
      },
    });
  }

  priorityLabel(priority: number): string {
    return ['Very Low', 'Low', 'Medium', 'High', 'Very High'][Math.max(0, Math.min(priority, 5) - 1)] ?? 'Very Low';
  }

  close(): void {
    this.open = false;
    this.closed.emit();
  }
}
