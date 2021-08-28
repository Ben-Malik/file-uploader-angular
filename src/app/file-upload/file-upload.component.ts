import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { FileService } from '../service';
import { UploadedFile } from '../file.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-upload-file',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  loaded = 0;
  selectedFiles!: FileList;
  uploadedFiles: UploadedFile[] = [];
  showProgress = false;
  isFileValid = true;
  fileUploadFailed = false;
  MAX_FILE_SIZE = 20000000; //20M
  fileInput:string = "";
  isAnyFileSelected = false;


  constructor(private http: HttpClient, private fileService: FileService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void { 
    this.isAnyFileSelected = false;
  
   }

  // Selected file is stored into selectedFiles.
  selectFile(event: any) {
    this.isFileValid = true;
    this.selectedFiles = event.target.files;
    Array.from(this.selectedFiles).forEach(file => {
      if (file.size > this.MAX_FILE_SIZE) {
        this.isFileValid = false;
        return;
      }
    });
    this.isAnyFileSelected = true;
  }

  // Uploads the file to backend server.
  upload() {
    this.showProgress = true;
    this.uploadedFiles = [];
    if (!this.isFileValid) {
      return;
    }
    Array.from(this.selectedFiles).forEach(file => {
      const uploadedFile = new UploadedFile();
      uploadedFile.fileName = file.name;
      uploadedFile.fileSize = file.size;
      if (uploadedFile.fileSize <= this.MAX_FILE_SIZE) {
        uploadedFile.isFileValid = true;
        this.uploadedFiles.push(uploadedFile);
        this.fileService.uploadFileToDB(file)
          .pipe(tap(event => {
            if (event.type === HttpEventType.UploadProgress) {
              const totalNum = event!.total;
              if (totalNum != null) {
                this.loaded = Math.round(100 * event.loaded / totalNum);
                uploadedFile.progress = this.loaded;
                this.fileInput = '';  
              } else {
                return;
              }
            }
          })).subscribe((event: any) => {
            if (event instanceof HttpResponse) {
              if (this.selectedFiles.item(this.selectedFiles.length - 1) === file) {
                this.fileService.fetchFiles();
                this.selectedFiles = new FileList;
                console.log(this.selectedFiles)
                this.isAnyFileSelected = false;
              }
            }
          });
      } else {
        uploadedFile.isFileValid = false;
        this.isFileValid = false;
        this.fileUploadFailed = true;
      }
    });
  }

}
