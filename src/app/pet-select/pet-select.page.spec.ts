import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetSelectPage } from './pet-select.page';

describe('PetSelectPage', () => {
  let component: PetSelectPage;
  let fixture: ComponentFixture<PetSelectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
