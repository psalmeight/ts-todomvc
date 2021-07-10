import { ChangeEvent, ChangeEventHandler } from "react";

export interface Todo {
  id: number;
  status: string;
  text: string;
}

export interface TodoAndEvents extends Todo {
  onChange?: (id: number) => (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (id: number) => void;
}

export type StateProps = {
  pendingCount: number | 0;
  filterType: string;
  currentText: string;
};
