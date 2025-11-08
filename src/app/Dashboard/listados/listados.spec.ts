import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listados } from './listados';

describe('Listados', () => {
  let component: Listados;
  let fixture: ComponentFixture<Listados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
