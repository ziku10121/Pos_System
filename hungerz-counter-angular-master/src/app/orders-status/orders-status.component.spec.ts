import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersStatusComponent } from './orders-status.component';

describe('OrdersStatusComponent', () => {
  let component: OrdersStatusComponent;
  let fixture: ComponentFixture<OrdersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
