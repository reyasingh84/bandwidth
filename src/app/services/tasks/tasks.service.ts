import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';
import { Observable } from 'rxjs';
import { TasksResponse, TasksResponseForm } from '../../models/tasks.model';

@Service()
export class TasksService {
    http = inject(HttpClient);

    getDashboardStats(): Observable<any>{
        const url = `${BASE_URL}/tasks/statistics`
        return this.http.get(url)
    }

    getDashboardTeamStats(): Observable<any>{
        const url = `${BASE_URL}/tasks/statistics/team`
        return this.http.get(url)
    }

    getAllTasks(): Observable<TasksResponse>{
        const url = `${BASE_URL}/tasks/all`
        return this.http.get<TasksResponse>(url)
    }

    addTask(task: TasksResponseForm): Observable<TasksResponse> {
        const url = `${BASE_URL}/tasks/create`;
        return this.http.post<TasksResponse>(url, task);
    }

    updateTask(taskId: string, field: string, value: unknown): Observable<unknown> {
        const url = `${BASE_URL}/task/update/${taskId}`;
        return this.http.put(url, { [field]: value });
    }

    updateTaskAssignee(taskId: string, assigneeId: string | null): Observable<unknown> {
        const url = `${BASE_URL}/task/update-assignee/${taskId}`;
        return this.http.put(url, { assignee_id: assigneeId });
    }
}
