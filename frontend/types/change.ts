export interface AddedClause {
  clause: string;
  text: string;
}

export interface ModifiedClause {
  clause: string;
  old: string;
  new: string;
}

export interface RemovedClause {
  clause: string;
  text: string;
}

export interface ChangeDetection {
  oldTitle: string;
  newTitle: string;
  added: AddedClause[];
  modified: ModifiedClause[];
  removed: RemovedClause[];
}
