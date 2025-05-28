import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbnosotrosComponent } from './sbnosotros.component';

describe('SbnosotrosComponent', () => {
  let component: SbnosotrosComponent;
  let fixture: ComponentFixture<SbnosotrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SbnosotrosComponent]
    });
    fixture = TestBed.createComponent(SbnosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
