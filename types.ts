export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  likes: number;
  createdAt: number;
  aiGenerated?: boolean;
}

export type IdeaFormData = Omit<Idea, 'id' | 'likes' | 'createdAt' | 'aiGenerated'>;

export enum ViewState {
  LIST = 'LIST',
  ADD = 'ADD',
  DETAIL = 'DETAIL',
  EDIT = 'EDIT'
}
