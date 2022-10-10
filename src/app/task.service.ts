import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TASKS } from './mock-tasks';
import { Task } from './task';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private url = 'http://localhost:8080/api/v1/tasks/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      tap((tasks) => this.log('fetched tasks')),
      catchError(this.handleError<Task[]>('getTasks', []))
    );
  }

  getTask(id: number): Observable<Task> {
    const url = `${this.url}${id}`;
    return this.http.get<Task>(url).pipe(
      tap((_) => this.log(`fetced hero id=${id}`)),
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(this.url, task, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${task.id}`)),
      catchError(this.handleError<any>('updateTask'))
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url, task, this.httpOptions).pipe(
      tap((newTask: Task) => this.log(`added task w/ id=${newTask.id}`)),
      catchError(this.handleError<Task>('addTask'))
    );
  }

  deleteTask(id: number): Observable<Task> {
    const url = `${this.url}${id}`;
    return this.http.delete<Task>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted task id=${id}`)),
      catchError(this.handleError<Task>('deleteTask'))
    );
  }

  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      // 検索語がない場合、空のタスく配列を返す
      return of([]);
    }
    const url = `${this.url}search/?name=${term}`;
    return this.http.get<Task[]>(url).pipe(
      tap((_) => this.log(`found tasks matching "${term}"`)),
      catchError(this.handleError<Task[]>('searchTasks', []))
    );
  }

  /**
   * 失敗したHttp操作を処理します。
   * アプリを持続させます。
   *
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`TaskService: ${message}`);
  }
}
