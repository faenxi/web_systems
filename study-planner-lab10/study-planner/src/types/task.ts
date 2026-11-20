export type Priority = 'low' | 'medium' | 'high';
export type Category = 'study' | 'lab' | 'project' | 'other';
export type Filter = 'all' | 'active' | 'completed';

/** Стан асинхронної операції: окремо від самих даних. */
export type LoadStatus = 'loading' | 'success' | 'error';

/** Domain-модель. UI працює лише з нею, а не з ApiTodo. */
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  completed: boolean;
}

/** Поля, які користувач вводить у формі (створення / редагування). */
export type TaskDraft = Pick<Task, 'title' | 'description' | 'priority' | 'category'>;

/** Часткова зміна існуючого завдання. */
export type TaskChanges = Partial<Omit<Task, 'id'>>;
