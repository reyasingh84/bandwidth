import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskPreviewComponent } from './task-preview.component';

describe('TaskPreviewComponent', () => {
  let component: TaskPreviewComponent;
  let fixture: ComponentFixture<TaskPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskPreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
