export interface Note {
  id: string;
  title: string | undefined;
  content: string | undefined;
  createdAt: Date;
  updatedAt: Date | undefined;
  deletedAt: Date | undefined;
}
