import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditCustomerComponent } from './admin-edit-customer.component';

describe('AdminEditCustomerComponent', () => {
  let component: AdminEditCustomerComponent;
  let fixture: ComponentFixture<AdminEditCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
