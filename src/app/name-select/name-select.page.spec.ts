import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NameSelectPage } from './name-select.page';

describe('NameSelectPage', () => {
  let component: NameSelectPage;
  let fixture: ComponentFixture<NameSelectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NameSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
