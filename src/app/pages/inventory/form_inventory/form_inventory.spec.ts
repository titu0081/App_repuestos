import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInventory } from './form_inventory';

describe('FormInventory', () => {
  let component: FormInventory;
  let fixture: ComponentFixture<FormInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInventory],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
