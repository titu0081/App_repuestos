import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrders } from './form_orders';

describe('FormOrders', () => {
  let component: FormOrders;
  let fixture: ComponentFixture<FormOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(FormOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
