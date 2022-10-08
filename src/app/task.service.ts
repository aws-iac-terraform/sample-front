import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 追加

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { } // HttpClientをインジェクト

  fetch(){ // 追加
    return this.httpClient.get('http://localhost:8080/api/v1/tasks/');
  }
}
