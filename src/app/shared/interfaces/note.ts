export interface Note {
  id: string;
  title: string;
  content: string;
  hexColor: string;
  createdAt: Date;
  updatedAt: Date | undefined;
  deletedAt: Date | undefined;
}
