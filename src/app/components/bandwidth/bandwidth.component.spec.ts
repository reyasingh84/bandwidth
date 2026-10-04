import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandwidthComponent } from './bandwidth.component';

describe('BandwidthComponent', () => {
  let component: BandwidthComponent;
  let fixture: ComponentFixture<BandwidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandwidthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BandwidthComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
