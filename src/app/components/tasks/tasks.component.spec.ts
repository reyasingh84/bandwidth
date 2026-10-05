import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponents } from './tasks.component';

describe('TasksComponents', () => {
  let component: TasksComponents;
  let fixture: ComponentFixture<TasksComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
