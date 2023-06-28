import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePrendaComponent } from './detalle-prenda.component';

describe('DetallePrendaComponent', () => {
  let component: DetallePrendaComponent;
  let fixture: ComponentFixture<DetallePrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePrendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
