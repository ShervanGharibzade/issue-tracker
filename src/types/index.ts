export interface Workspace {
  id: string;
  title: string;
  isFavorite: boolean;
}

export interface Column {
  id: string;
  workSpaceId: string;
  title: string;
}

export interface Task {
  id: string;
  workSpaceId: string;
  columnId: string;
  description: string;
  assignees: string[];
}

export interface UserProfile {
  name: string;
  lastName: string;
}
