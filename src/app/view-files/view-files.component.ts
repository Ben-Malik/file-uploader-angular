import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileService} from '../service';
import {DomSanitizer} from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { Byte } from '@angular/compiler/src/util';

@Component({
  selector: 'app-view-files',
  templateUrl: './view-files.component.html',
  styleUrls: ['./view-files.component.css']
})

export class ViewFilesComponent implements OnInit {

  files: any [] = [];
  groupedFiles: any[] = [];
  keys: any[] = [];
  group: string = "fileType";
  headers = ["File Name", "File Size", "File Type", "Upload Date", ""];
  filesLoaded = false;

  constructor(private http: HttpClient, public fileService: FileService, private sanitizer: DomSanitizer, 
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.fetchAndGroupifyFiles();
  }

  // Doanloads a file with given file content, name and type.
  downloadFile(base64String:string, fileName:string, fileType:string){
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download file in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : fileType});
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}`);
    } else {
      // Download file in Chrome etc.
      const source = `data:${fileType};base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}`
      link.click();
    }
  }

  // Called to download a given file matching given parameters.
  onClickDownloadFile(base64String:string, fileName:string, fileType:string){
    this.downloadFile(base64String, fileName, fileType);
  }

  // Fetches the file names to display in list.
  fetchAndGroupifyFiles() {
    this.fileService.fetchFiles().subscribe(files => {
      if (files) {
        this.spinner.hide();
        this.filesLoaded = true;
      }
      this.files = files;
      const groupByFileType = this.groupBy(this.group);

      this.keys = Object.keys(groupByFileType(this.files));
      this.groupedFiles = groupByFileType(this.files);
    });
  }

  // Groups a given array of object by the given key.
  groupBy = (key: string ) => (array: any[]) =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );

}
