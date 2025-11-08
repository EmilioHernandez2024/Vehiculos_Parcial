import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardMenu } from './dasboard-menu';

describe('DasboardMenu', () => {
  let component: DasboardMenu;
  let fixture: ComponentFixture<DasboardMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
