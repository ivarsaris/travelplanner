import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRouteMapComponent } from './display-route-map.component';

describe('DisplayRouteMapComponent', () => {
  let component: DisplayRouteMapComponent;
  let fixture: ComponentFixture<DisplayRouteMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayRouteMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayRouteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
