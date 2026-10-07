import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TeamsService } from '../../services/teams/teams.service';
import { AddTeamBody, TeamInfo } from '../../models/team.model';
import { Spinner } from '@primeicons/angular/spinner';
import { Users } from '@primeicons/angular/users';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../services/users/users.service';

@Component({
  imports: [Spinner, Users, DatePipe, ButtonModule],
  selector: 'bw-teams',
  styleUrl: './teams.component.css',
  templateUrl: './teams.component.html',
})
export class TeamsComponent implements OnInit {
  teamsService = inject(TeamsService);
  usersService = inject(UsersService);
  messageService = inject(MessageService);

  allTeamsList = signal<TeamInfo[]>([]);
  isLoadingData = signal(false);
  isAddingTeam = false;
  editingTeam: TeamInfo | null = null;
  isSubmittingTeam = false;

  get isAdmin(): boolean {
    return this.usersService.getUserInfo()?.role?.trim().toLowerCase() === 'admin';
  }

  ngOnInit(): void {
    this.fetchTeams();
  }

  fetchTeams() {
    this.isLoadingData.set(true);
    this.teamsService.getAllTeams().subscribe({
      next: (res) => {
        this.allTeamsList.set(res.response);
        this.isLoadingData.set(false);
      },
      error: (err) => {
        this.isLoadingData.set(false);
      },
    });
  }

  onClickAddTeam(){
    this.editingTeam = null;
    this.isAddingTeam = true;
  }

  onClickEditTeam(team: TeamInfo): void {
    this.editingTeam = team;
    this.isAddingTeam = true;
  }

  onSubmitTeamForm(form: HTMLFormElement, event: SubmitEvent): void {
    event.preventDefault();

    if (this.isSubmittingTeam) {
      return;
    }

    const formValue = new FormData(form);
    const team: AddTeamBody = {
      name: String(formValue.get('teamName')).trim(),
      description: String(formValue.get('teamDescription')).trim(),
      short_name: String(formValue.get('teamShortName')).trim().toUpperCase(),
    };

    this.isSubmittingTeam = true;
    const request = this.editingTeam
      ? this.teamsService.updateTeam(this.editingTeam.id, team)
      : this.teamsService.addTeam(team);

    request.subscribe({
      next: () => {
        this.isAddingTeam = false;
        this.isSubmittingTeam = false;
        this.messageService.add({
          severity: 'success',
          summary: this.editingTeam ? 'Team updated' : 'Team created',
          detail: `${team.name} was ${this.editingTeam ? 'updated' : 'added'} successfully.`,
        });
        this.fetchTeams();
        this.editingTeam = null;
      },
      error: (error) => {
        this.isSubmittingTeam = false;
        this.messageService.add({
          severity: 'error',
          summary: `Team ${this.editingTeam ? 'update' : 'creation'} failed`,
          detail: `The team could not be ${this.editingTeam ? 'updated' : 'added'}. Please try again.`,
        });
      },
    });
  }

  onCancelAddTeam(): void {
    if (this.isSubmittingTeam) {
      return;
    }

    this.isAddingTeam = false;
    this.editingTeam = null;
  }
}
