import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEditables } from './productos-editables';

describe('ProductosEditables', () => {
  let component: ProductosEditables;
  let fixture: ComponentFixture<ProductosEditables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosEditables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosEditables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
