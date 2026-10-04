import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TaskCountStats } from '../../models/tasks.model';
import { Clock } from '@primeicons/angular/clock';
import { Clipboard } from '@primeicons/angular/clipboard';
import { CheckCircle } from '@primeicons/angular/check-circle';
import { ExclamationTriangle } from '@primeicons/angular/exclamation-triangle';
import { ChartModule } from 'primeng/chart';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/user.model';
import {
  chart_colour_1,
  chart_colour_2,
  chart_colour_3,
  chart_colour_4,
  chart_colour_5,
  chart_colour_6,
  chart_colour_overdue,
} from '../../constants/chart-colors';

@Component({
  imports: [CardModule, Clock, Clipboard, CheckCircle, ExclamationTriangle, ChartModule],
  selector: 'bw-dashboard',
  styleUrl: './dashboard.component.css',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  taskService = inject(TasksService);
  messageService = inject(MessageService);
  usersService = inject(UsersService);
  userInfo: User | null = this.usersService.getUserInfo();
  overdueTaskStats = signal<TaskCountStats>({
    open: 0,
    in_progress: 0,
    review: 0,
    testing: 0,
    closed: 0,
    on_hold: 0,
    total: 0
  })
  allTaskStats = signal<TaskCountStats>({
    open: 0,
    in_progress: 0,
    review: 0,
    testing: 0,
    closed: 0,
    on_hold: 0,
    total: 0
  })

  taskStatusChartData = computed(() => ({
    labels: ['Open', 'In Progress', 'Review', 'Testing', 'Closed', 'On Hold'],
    datasets: [
      {
        data: [
          this.allTaskStats().open,
          this.allTaskStats().in_progress,
          this.allTaskStats().review,
          this.allTaskStats().testing,
          this.allTaskStats().closed,
          this.allTaskStats().on_hold,
        ],
        backgroundColor: [
          chart_colour_1,
          chart_colour_2,
          chart_colour_3,
          chart_colour_4,
          chart_colour_5,
          chart_colour_6,
        ],
        hoverBackgroundColor: [
          chart_colour_1,
          chart_colour_2,
          chart_colour_3,
          chart_colour_4,
          chart_colour_5,
          chart_colour_6,
        ],
      },
    ],
  }));

  overdueStatusChartData = computed(() => ({
    labels: ['Open', 'In Progress', 'Review', 'Testing', 'On Hold'],
    datasets: [
      {
        label: 'Overdue Tasks',
        data: [
          this.overdueTaskStats().open,
          this.overdueTaskStats().in_progress,
          this.overdueTaskStats().review,
          this.overdueTaskStats().testing,
          this.overdueTaskStats().on_hold,
        ],
        backgroundColor: [
          chart_colour_overdue,
          chart_colour_2,
          chart_colour_3,
          chart_colour_4,
          chart_colour_6,
        ],
        borderColor: [
          chart_colour_overdue,
          chart_colour_2,
          chart_colour_3,
          chart_colour_4,
          chart_colour_6,
        ],
        borderWidth: 1,
      },
    ],
  }));

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  ngOnInit(): void {
    this.fetchDashboardData()
  }

  fetchDashboardData(){
    this.taskService.getDashboardStats().subscribe({
      next: (res)=> {
        const response = res?.response;
        this.allTaskStats.set(response?.task_count);
        this.overdueTaskStats.set(response?.overdue_task_count)
      },
      error: (err)=> {
        console.log(err);
        this.messageService.add({
          summary: "Failed to Load Data.",
          detail: "Something went wrong.",
          severity: 'error'
        })
      },
      complete: ()=> {console.log("Completed")}
    })
  }
}
