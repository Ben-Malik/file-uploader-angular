import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFilesComponent } from './view-files.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('ViewFilesComponent', () => {
  let component: ViewFilesComponent;
  let fixture: ComponentFixture<ViewFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
