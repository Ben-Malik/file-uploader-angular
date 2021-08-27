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
}