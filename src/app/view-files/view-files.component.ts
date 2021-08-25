import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileService} from '../service';
import {DomSanitizer} from '@angular/platform-browser';
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
  constructor(private http: HttpClient, private fileService: FileService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchFiles();
  }

  downloadPdf(base64String:string, fileName:string, fileType:string){
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : fileType});
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:${fileType};base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}`
      link.click();
    }
  }
  onClickDownloadPdf(base64String:string, fileName:string, fileType:string){
    this.downloadPdf(base64String, fileName, fileType);
  }

  // Fetches the file names to display in list.
  fetchFiles() {
    this.fileService.fetchFiles().subscribe(files => {
      this.files = files;
      const groupByFileType = this.groupBy('fileType');

      this.keys = Object.keys(groupByFileType(this.files));
      this.groupedFiles = groupByFileType(this.files);
    });

  }

  groupBy = (key: string ) => (array: any[]) =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );
	

}
