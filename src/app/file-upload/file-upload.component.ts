import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { FileService } from '../service';
import { UploadedFile } from '../file.model';
import { MatSnackBar } from '@angular/material/snack-bar';

const MAX_FILE_SIZE = 20000000; //20M
const FORBIDDEN_FILES = ["js", "html", "php", "java"];

@Component({
  selector: 'app-multi-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  loaded = 0;
  selectedFiles!: FileList;
  uploadedFiles: UploadedFile[] = [];
  showProgress = false;
  isFileValid = true;

  constructor(private http: HttpClient, private fileService: FileService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {  }

  // Selected file is stored into selectedFiles.
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  // Uploads the file to backend server.
  upload() {
    this.showProgress = true;
    this.uploadedFiles = [];
    Array.from(this.selectedFiles).forEach(file => {
      const uploadedFile = new UploadedFile();
      uploadedFile.fileName = file.name;
      uploadedFile.fileSize = file.size;
      if (uploadedFile.fileSize <= MAX_FILE_SIZE) {
        uploadedFile.isFileValid = true;
        this.uploadedFiles.push(uploadedFile);
        this.fileService.uploadFileToDB(file)
          .pipe(tap(event => {
            if (event.type === HttpEventType.UploadProgress) {
              const totalNum = event!.total;
              if (totalNum != null) {
                this.loaded = Math.round(100 * event.loaded / totalNum);
                uploadedFile.progress = this.loaded;

              } else {
                return;
              }
            }
          })).subscribe((event: any) => {
            if (event instanceof HttpResponse) {
              if (this.selectedFiles.item(this.selectedFiles.length - 1) === file) {
                // Invokes fetchFileNames() when last file in the list is uploaded.
                this.fileService.fetchFiles();
              }
            }
          });
      } else {
        uploadedFile.isFileValid = false;
        this.isFileValid = false;
      }
    });
  }

}
