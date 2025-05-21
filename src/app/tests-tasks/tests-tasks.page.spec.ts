import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestsTasksPage } from './tests-tasks.page';

describe('TestsTasksPage', () => {
  let component: TestsTasksPage;
  let fixture: ComponentFixture<TestsTasksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
