import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileUploadComponent } from './file-upload.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadComponent ],
      imports: [ HttpClientTestingModule, MatSnackBarModule ],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
  });

  it("The isFileValid attribute should be true initially", () => {
    fixture.detectChanges();
    expect(true).toEqual(component.isFileValid);
  });

  it("File size is larger than allowed should not be shown", () => {
    component.isFileValid = false;

    fixture.detectChanges();
    const compiled = fixture.debugElement.classes;
    expect(compiled['file-oversize']).toBeUndefined();
  })
});
