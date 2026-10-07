import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { MenuItem, MessageService } from 'primeng/api';
import { TaskInfo, TasksResponseForm } from '../../models/tasks.model';
import { Spinner } from '@primeicons/angular/spinner';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { TeamsService } from '../../services/teams/teams.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [Spinner, DatePipe, KeyValuePipe, SplitButtonModule, ButtonModule, ReactiveFormsModule],
  selector: 'bw-tasks',
  styleUrl: './tasks.component.css',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit{
  userService = inject(UsersService)
  taskService = inject(TasksService)
  teamsService = inject(TeamsService)
  messageService = inject(MessageService)

  allTasksList = signal<TaskInfo[]>([]);
  isLoadingData = signal(false);
  readonly currentTime = Math.floor(Date.now() / 1000);
  teamNames = signal<Record<string, string>>({});
  searchTerm = signal('');
  selectedTeam = signal('all');
  selectedStatus = signal('all');
  selectedPriority = signal('all');
  isAddingTask = false;
  isSubmittingTask = false;

  get isAdmin(): boolean {
    return this.userService.getUserInfo()?.role?.trim().toLowerCase() === 'admin';
  }

  filteredTasks = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const team = this.selectedTeam();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();

    return this.allTasksList().filter((task) => {
      const matchesSearch = !search
        || task.title.toLowerCase().includes(search)
        || this.getTeamName(task).toLowerCase().includes(search)
        || (task.assignee_username ?? '').toLowerCase().includes(search);
      const matchesTeam = team === 'all' || task.team_id === team;
      const matchesStatus = status === 'all' || task.status === status;
      const matchesPriority = priority === 'all' || this.priorityLabel(task.priority) === priority;

      return matchesSearch && matchesTeam && matchesStatus && matchesPriority;
    });
  });


  ngOnInit(): void {
    this.fetchTasks();
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.teamsService.getAllTeams().subscribe({
      next: (res) => {
        const names = res.response.reduce<Record<string, string>>((teamMap, team) => {
          teamMap[team.id] = team.name;
          return teamMap;
        }, {});
        this.teamNames.set(names);
      },
      error: (err) => {
        console.error('Unable to load team names', err);
      },
    });
  }

  get teamFilterItems(): MenuItem[] {
    return [
      { label: 'All teams', command: () => this.selectedTeam.set('all') },
      ...Object.entries(this.teamNames()).map(([id, name]) => ({
        label: name,
        command: () => this.selectedTeam.set(id),
      })),
    ];
  }

  readonly statusFilterItems: MenuItem[] = [
    { label: 'All statuses', command: () => this.selectedStatus.set('all') },
    { label: 'Open', command: () => this.selectedStatus.set('open') },
    { label: 'In Progress', command: () => this.selectedStatus.set('in_progress') },
    { label: 'Review', command: () => this.selectedStatus.set('review') },
    { label: 'Testing', command: () => this.selectedStatus.set('testing') },
    { label: 'Closed', command: () => this.selectedStatus.set('closed') },
    { label: 'On Hold', command: () => this.selectedStatus.set('on_hold') },
  ];

  readonly priorityFilterItems: MenuItem[] = [
    { label: 'All priorities', command: () => this.selectedPriority.set('all') },
    { label: 'Critical', command: () => this.selectedPriority.set('Critical') },
    { label: 'High', command: () => this.selectedPriority.set('High') },
    { label: 'Medium', command: () => this.selectedPriority.set('Medium') },
    { label: 'Low', command: () => this.selectedPriority.set('Low') },
  ];

  get teamFilterLabel(): string {
    return this.selectedTeam() === 'all'
      ? 'All teams'
      : this.teamNames()[this.selectedTeam()] ?? 'All teams';
  }

  get statusFilterLabel(): string {
    return this.selectedStatus() === 'all' ? 'All statuses' : this.formatStatus(this.selectedStatus());
  }

  get priorityFilterLabel(): string {
    return this.selectedPriority() === 'all' ? 'All priorities' : this.selectedPriority();
  }

  getTeamName(task: TaskInfo): string {
    return task.team_name || this.teamNames()[task.team_id] || task.team_id;
  }

  addTaskForm: FormGroup = new FormGroup({
    team_id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
    category: new FormControl('', Validators.required),
    priority: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
    proj_name: new FormControl(''),
    assignee_id: new FormControl(''),
    assignee_username: new FormControl(''),
    deadline: new FormControl('', Validators.required),
  });

  onClickAddTask(): void {
    this.addTaskForm.reset({
      team_id: Object.keys(this.teamNames())[0] ?? '',
      title: '',
      description: '',
      category: '',
      priority: 1,
      proj_name: '',
      assignee_id: '',
      assignee_username: '',
      deadline: '',
    });
    this.isAddingTask = true;
  }

  onSubmitTaskForm(): void {
    if (this.isSubmittingTask) {
      return;
    }

    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched();
      return;
    }

    const value = this.addTaskForm.getRawValue();
    const task: TasksResponseForm = {
      title: value.title?.trim() ?? '',
      description: value.description?.trim() ?? '',
      category: value.category as TasksResponseForm['category'],
      priority: Number(value.priority),
      proj_name: value.proj_name?.trim() ?? '',
      deadline: Math.floor(new Date(`${value.deadline}T23:59:59`).getTime() / 1000),
    };

    if (value.team_id) {
      task.team_id = value.team_id;
    }

    if (value.assignee_id?.trim()) {
      task.assignee_id = value.assignee_id.trim();
    }

    if (value.assignee_username?.trim()) {
      task.assignee_username = value.assignee_username.trim();
    }

    this.isSubmittingTask = true;
    this.taskService.addTask(task).subscribe({
      next: () => {
        this.isAddingTask = false;
        this.isSubmittingTask = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Task created',
          detail: `${task.title} was added successfully.`,
        });
        this.fetchTasks();
      },
      error: (error) => {
        console.error('Unable to create task', error);
        this.isSubmittingTask = false;
        const validationDetail = error.error?.detail;
        this.messageService.add({
          severity: 'error',
          summary: 'Task creation failed',
          detail: Array.isArray(validationDetail)
            ? validationDetail.map((item: { msg?: string }) => item.msg ?? 'Invalid task data').join('. ')
            : validationDetail || 'The task could not be added. Please try again.',
        });
      },
    });
  }

  onCancelAddTask(): void {
    if (this.isSubmittingTask) {
      return;
    }

    this.isAddingTask = false;
    this.addTaskForm.reset();
  }

  getAssigneeInitials(task: TaskInfo): string {
    const firstName = task.assignee_first_name?.trim();
    const lastName = task.assignee_last_name?.trim();

    if (firstName || lastName) {
      return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
    }

    const username = task.assignee_username?.trim();
    if (!username) {
      return 'U';
    }

    const nameParts = username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(/[\s._-]+/)
      .filter(Boolean);

    return nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : username.slice(0, 2).toUpperCase();
  }

  fetchTasks(){
    this.isLoadingData.set(true)
    this.taskService.getAllTasks().subscribe({
      
      next:(res)=>{
        this.allTasksList.set(res.response);
        this.isLoadingData.set(false);
      },
      error:(err)=>{
        console.error('Unable to load tasks', err);
        this.isLoadingData.set(false);
      },
    })
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  }

  priorityLabel(priority: number): string {
    if (priority >= 8) {
      return 'Critical';
    }

    if (priority >= 5) {
      return 'High';
    }

    if (priority >= 3) {
      return 'Medium';
    }

    return 'Low';
  }
}
