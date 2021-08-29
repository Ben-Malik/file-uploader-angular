import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class FileService {
 
  constructor(private http: HttpClient) {
  }
 
  /**
   * Uploads the given file into the Database
   * @param file The file to be saved.
   * @returns  an object of the filename and progress of the upload.
   */
  uploadFileToDB(file: any): Observable<HttpEvent<{}>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      'https://localhost:8002/upload',
      formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }
 
  /**
   * Grabs files from the database.
   * @returns a list of files.
   */
  fetchFiles() {
    return this.http
      .get<any[]>('https://localhost:8002/view-files');
  }

  /**
   * Converts a given value of bytes into it's corresponding exact unit.
   * @param bytes the bytes to be formated.
   * @param decimals  the precision after the dot: 2 if not given.
   * @returns string for the size + size unit. Eg: 12.50 MB
   */
  formatBytes(bytes:any, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

