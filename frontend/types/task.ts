export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";
export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  department: string;
  owner: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  progress: number;
  evidence: boolean;
}
