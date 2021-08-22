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
  headers = ["File Name", "File Size", "File Type", "Upload Date"];
  constructor(private http: HttpClient, private fileService: FileService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchFiles();
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
