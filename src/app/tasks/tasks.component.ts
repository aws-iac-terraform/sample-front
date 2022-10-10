import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskSerivce: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskSerivce.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.taskSerivce.addTask({ name } as Task).subscribe((task) => {
      this.tasks.push(task);
    });
  }

  delete(task: Task): void {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.taskSerivce.deleteTask(task.id).subscribe();
  }
}
